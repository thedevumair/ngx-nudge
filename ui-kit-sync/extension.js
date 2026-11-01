const vscode = require('vscode');
const http = require('http');
const path = require('path');
const fs = require('fs');

let server;

function activate(context) {
  server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }
    if (req.method !== 'POST' || req.url !== '/columns') {
      res.writeHead(404);
      return res.end();
    }

    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', async () => {
      try {
        const { id, prop = 'columns', value, columns } = JSON.parse(body);
        const ok = await applyColumns(id, prop, value ?? columns);
        res.writeHead(ok ? 200 : 404);
        res.end(ok ? 'ok' : 'table/columns not found');
      } catch (e) {
        res.writeHead(500);
        res.end(String(e));
      }
    });
  });

  server.listen(4567, '127.0.0.1');
  vscode.window.setStatusBarMessage('UI Kit Sync: listening on 4567', 5000);
  context.subscriptions.push({ dispose: () => server && server.close() });
}

function loadTs() {
  const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!root) throw new Error('No workspace folder open');
  return require(path.join(root, 'node_modules', 'typescript'));
}

async function applyColumns(id, inputName, value) {
  const ts = loadTs();
  const files = await vscode.workspace.findFiles(
    '**/*.{ts,html}',
    '{**/node_modules/**,**/dist/**,**/.angular/**}',
  );
  const tagRe = new RegExp(`<ui-[\\w-]+\\b[^>]*\\bsyncId="${id}"[^>]*>`);
  const bindRe = new RegExp(`\\[${inputName}\\]\\s*=\\s*"\\s*([A-Za-z_$][\\w$]*)\\s*"`);

  for (const uri of files) {
    const text = fs.readFileSync(uri.fsPath, 'utf8');
    const tag = tagRe.exec(text);
    if (!tag) continue;

    const bind = bindRe.exec(tag[0]);
    if (!bind) continue;
    const propName = bind[1];

    // inline template: isi .ts file mein; alag template: usi naam ki .ts file
    const ownerPath = uri.fsPath.endsWith('.html')
      ? uri.fsPath.replace(/\.html$/, '.ts')
      : uri.fsPath;
    if (!fs.existsSync(ownerPath)) continue;

    const ok = await replaceProperty(ts, vscode.Uri.file(ownerPath), propName, value);
    if (ok) return true;
  }
  return false;
}

async function replaceProperty(ts, uri, prop, value) {
  const doc = await vscode.workspace.openTextDocument(uri); // unsaved content bhi milta hai
  const text = doc.getText();
  const sf = ts.createSourceFile(uri.fsPath, text, ts.ScriptTarget.Latest, true);

  let target;
  const visit = (node) => {
    if (target) return;
    if (
      ts.isPropertyDeclaration(node) &&
      node.name.getText(sf) === prop &&
      node.initializer &&
      ts.isArrayLiteralExpression(node.initializer)
    ) {
      target = node;
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  if (!target) return false;

  const init = target.initializer;
  const lineStart = text.lastIndexOf('\n', target.getStart(sf)) + 1;
  const indent = text.slice(lineStart).match(/^[ \t]*/)[0];

  const lines = value.map((c) => {
    const { order, ...rest } = c; // array ki position hi order hai
    const props = Object.entries(rest)
      .map(([k, v]) => `${k}: ${typeof v === 'string' ? `'${v.replace(/'/g, "\\'")}'` : v}`)
      .join(', ');
    return `${indent}  { ${props} },`;
  });
  const newText = `[\n${lines.join('\n')}\n${indent}]`;

  const edit = new vscode.WorkspaceEdit();
  edit.replace(
    uri,
    new vscode.Range(doc.positionAt(init.getStart(sf)), doc.positionAt(init.getEnd())),
    newText,
  );
  await vscode.workspace.applyEdit(edit); // save nahi karta
  await vscode.window.showTextDocument(doc, { preview: false, preserveFocus: true });
  return true;
}

function deactivate() {
  if (server) server.close();
}

module.exports = { activate, deactivate };
