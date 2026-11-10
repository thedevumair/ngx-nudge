const vscode = require('vscode');
const http = require('http');
const path = require('path');
const fs = require('fs');

let server;
let why = 'target not found';
let statusItem;
const PORTS = [4567, 4568, 4569, 4570, 4571];

function setStatus(text, warn) {
  statusItem.text = `$(${warn ? 'warning' : 'check'}) Nudge Sync: ${text}`;
  statusItem.backgroundColor = warn
    ? new vscode.ThemeColor('statusBarItem.warningBackground')
    : undefined;
  statusItem.show();
}

function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }
  if (req.method !== 'POST' || (req.url !== '/columns' && req.url !== '/tokens')) {
    res.writeHead(404);
    return res.end();
  }

  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', async () => {
    try {
      const data = JSON.parse(body);
      const ok =
        req.url === '/tokens'
          ? await applyTokens(data.tokens)
          : await applyColumns(data.id, data.prop ?? 'columns', data.value ?? data.columns);
      // 404 means "not in this window's workspace"; the library tries the next port
      res.writeHead(ok ? 200 : 404);
      res.end(ok ? 'ok' : why);
    } catch (e) {
      res.writeHead(500);
      res.end(String(e));
    }
  });
}

function listen(i) {
  if (i >= PORTS.length) {
    setStatus('no free port (4567-4571)', true);
    return;
  }
  const s = http.createServer(handler);
  s.once('error', (e) => {
    if (e.code === 'EADDRINUSE') listen(i + 1);
    else setStatus(String(e), true);
  });
  s.listen(PORTS[i], '127.0.0.1', () => {
    server = s;
    setStatus(`ON (${PORTS[i]})`);
  });
}

function startServer() {
  if (!server) listen(0);
}

function activate(context) {
  statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
  context.subscriptions.push(statusItem);

  if (vscode.workspace.isTrusted) {
    startServer();
  } else {
    setStatus('OFF - trust this folder to enable', true);
    context.subscriptions.push(vscode.workspace.onDidGrantWorkspaceTrust(() => startServer()));
  }
  context.subscriptions.push({ dispose: () => server && server.close() });
}

function loadTs() {
  const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!root) throw new Error('No workspace folder open');
  return require(path.join(root, 'node_modules', 'typescript'));
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function applyTokens(tokens) {
  const files = await vscode.workspace.findFiles(
    '**/*.{scss,css}',
    '{**/node_modules/**,**/dist/**,**/.angular/**}',
  );
  const edit = new vscode.WorkspaceEdit();
  const pending = new Map(Object.entries(tokens));

  // 1) Where the variable already exists, update its value in place
  for (const uri of files) {
    if (!pending.size) break;
    const doc = await vscode.workspace.openTextDocument(uri); // also returns unsaved content
    const text = doc.getText();
    for (const [name, value] of [...pending]) {
      const m = new RegExp(`(${esc(name)}\\s*:\\s*)([^;}]+)`).exec(text);
      if (!m) continue;
      const start = m.index + m[1].length;
      edit.replace(
        uri,
        new vscode.Range(doc.positionAt(start), doc.positionAt(start + m[2].length)),
        value,
      );
      pending.delete(name);
    }
  }

  // 2) Anything not found goes into the global styles file's :root
  if (pending.size) {
    const globals = await vscode.workspace.findFiles(
      '**/styles.{scss,css}',
      '{**/node_modules/**,**/dist/**,**/.angular/**}',
      1,
    );
    if (!globals.length) return false;
    const uri = globals[0];
    const doc = await vscode.workspace.openTextDocument(uri);
    const text = doc.getText();
    const lines = [...pending].map(([k, v]) => `  ${k}: ${v};`).join('\n');
    const root = /:root\s*\{/.exec(text);
    if (root) {
      edit.insert(uri, doc.positionAt(root.index + root[0].length), `\n${lines}`);
    } else {
      edit.insert(uri, doc.positionAt(text.length), `\n:root {\n${lines}\n}\n`);
    }
  }

  await vscode.workspace.applyEdit(edit); // does not save
  vscode.window.setStatusBarMessage('UI Kit Sync: styles updated (unsaved)', 2500);
  return true;
}

const unwrap = (ts, n) => {
  while (
    n &&
    (ts.isParenthesizedExpression(n) ||
      ts.isAsExpression(n) ||
      ts.isNonNullExpression(n) ||
      (ts.isSatisfiesExpression && ts.isSatisfiesExpression(n)))
  ) {
    n = n.expression;
  }
  return n;
};

// Finds an array/object literal behind: literal, signal(literal), or a top-level const
function literalFrom(ts, sf, node, kind, depth = 0) {
  const n = unwrap(ts, node);
  if (!n || depth > 3) return null;
  if (kind === 'array' ? ts.isArrayLiteralExpression(n) : ts.isObjectLiteralExpression(n)) return n;
  if (
    ts.isCallExpression(n) &&
    ts.isIdentifier(n.expression) &&
    ['signal', 'model'].includes(n.expression.text) &&
    n.arguments[0]
  ) {
    return literalFrom(ts, sf, n.arguments[0], kind, depth + 1);
  }
  if (ts.isIdentifier(n)) {
    for (const st of sf.statements) {
      if (!ts.isVariableStatement(st)) continue;
      for (const d of st.declarationList.declarations) {
        if (ts.isIdentifier(d.name) && d.name.text === n.text && d.initializer) {
          return literalFrom(ts, sf, d.initializer, kind, depth + 1);
        }
      }
    }
  }
  return null;
}

// chain = ['columns'] or ['cfg', 'cols']
function findArray(ts, sf, chain) {
  let member;
  const visit = (n) => {
    if (member) return;
    if (ts.isPropertyDeclaration(n) && n.name.getText(sf) === chain[0]) {
      member = n;
      return;
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  if (!member || !member.initializer) return null;
  let init = member.initializer;
  for (let i = 1; i < chain.length; i++) {
    const obj = literalFrom(ts, sf, init, 'object');
    const prop =
      obj &&
      obj.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText(sf) === chain[i]);
    if (!prop) return null;
    init = prop.initializer;
  }
  return literalFrom(ts, sf, init, 'array');
}

// Only plain data is safe to rewrite; calls, functions or references would be lost
function isPlain(ts, node) {
  let plain = true;
  const visit = (n) => {
    if (!plain) return;
    if (
      ts.isCallExpression(n) ||
      ts.isArrowFunction(n) ||
      ts.isFunctionExpression(n) ||
      ts.isPropertyAccessExpression(n) ||
      ts.isTemplateExpression(n) ||
      ts.isSpreadElement(n) ||
      ts.isSpreadAssignment(n) ||
      ts.isShorthandPropertyAssignment(n) ||
      ts.isComputedPropertyName(n) ||
      (ts.isIdentifier(n) &&
        n.text !== 'undefined' &&
        !(n.parent && ts.isPropertyAssignment(n.parent) && n.parent.name === n))
    ) {
      plain = false;
      return;
    }
    ts.forEachChild(n, visit);
  };
  visit(node);
  return plain;
}

const fmt = (v) =>
  typeof v === 'string'
    ? `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
    : typeof v === 'object' && v !== null
      ? JSON.stringify(v)
      : String(v);

// "cfg?.cols", "this.columns()", "cfg().cols" -> ['cfg', 'cols']
function parseChain(raw) {
  const e = raw
    .replace(/\s+/g, '')
    .replace(/\(\)/g, '')
    .replace(/[?!]\./g, '.')
    .replace(/^this\./, '');
  return /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/.test(e) ? e.split('.') : null;
}

async function applyColumns(id, inputName, value) {
  why = `no <nd-...> tag with syncId="${id}" found in this workspace`;
  const ts = loadTs();
  const files = await vscode.workspace.findFiles(
    '**/*.{ts,html}',
    '{**/node_modules/**,**/dist/**,**/.angular/**}',
  );
  const tagRe = new RegExp(`<nd-[\\w-]+\\b[^>]*\\bsyncId="${esc(id)}"[^>]*>`);
  const bindRe = new RegExp(`\\[${esc(inputName)}\\]\\s*=\\s*"([^"]+)"`);

  for (const uri of files) {
    const text = fs.readFileSync(uri.fsPath, 'utf8');
    const tag = tagRe.exec(text);
    if (!tag) continue;

    const bind = bindRe.exec(tag[0]);
    if (!bind) {
      why = `tag "${id}" has no [${inputName}] binding`;
      continue;
    }
    const chain = parseChain(bind[1]);
    if (!chain) {
      why = `binding "${bind[1]}" is not a plain property (use x, x(), or a.b)`;
      continue;
    }

    // inline template: same .ts file; external template: the .ts file with the same name
    const ownerPath = uri.fsPath.endsWith('.html')
      ? uri.fsPath.replace(/\.html$/, '.ts')
      : uri.fsPath;
    if (!fs.existsSync(ownerPath)) {
      why = `no .ts file next to ${path.basename(uri.fsPath)}`;
      continue;
    }

    if (await replaceProperty(ts, vscode.Uri.file(ownerPath), chain, value)) return true;
  }
  return false;
}

async function replaceProperty(ts, uri, chain, value) {
  const doc = await vscode.workspace.openTextDocument(uri); // also returns unsaved content
  const text = doc.getText();
  const sf = ts.createSourceFile(uri.fsPath, text, ts.ScriptTarget.Latest, true);
  const name = chain.join('.');

  const arr = findArray(ts, sf, chain);
  if (!arr) {
    why = `no array found for "${name}" in ${path.basename(uri.fsPath)} (use x = [...], x = signal([...]), a.b = [...] or a top-level const)`;
    return false;
  }
  if (!isPlain(ts, arr)) {
    why = `"${name}" contains calls, functions or references, so it is not safe to rewrite`;
    return false;
  }

  const lineStart = text.lastIndexOf('\n', arr.getStart(sf)) + 1;
  const indent = text.slice(lineStart).match(/^[ \t]*/)[0];
  const lines = value.map((c) => {
    const { order, ...rest } = c; // the array position is the order
    const props = Object.entries(rest)
      .map(([k, v]) => `${k}: ${fmt(v)}`)
      .join(', ');
    return `${indent}  { ${props} },`;
  });
  const newText = `[\n${lines.join('\n')}\n${indent}]`;

  const edit = new vscode.WorkspaceEdit();
  edit.replace(
    uri,
    new vscode.Range(doc.positionAt(arr.getStart(sf)), doc.positionAt(arr.getEnd())),
    newText,
  );
  await vscode.workspace.applyEdit(edit); // does not save
  await vscode.window.showTextDocument(doc, { preview: false, preserveFocus: true });
  return true;
}

function deactivate() {
  if (server) server.close();
}

module.exports = { activate, deactivate };
