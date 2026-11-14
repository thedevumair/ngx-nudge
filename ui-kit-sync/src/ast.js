'use strict';

/** Strips (x), x as T, x!, x satisfies T. */
function unwrap(ts, node) {
  let n = node;
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
}

/** Finds an array/object literal behind: a literal, signal(literal), or a top-level const. */
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

/** chain = ['columns'] or ['cfg', 'cols'] */
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

/** Only plain data is safe to rewrite; calls, functions or references would be lost. */
function isPlain(ts, node) {
  let plain = true;
  const visit = (n) => {
    if (!plain) return;
    const isPropertyName = n.parent && ts.isPropertyAssignment(n.parent) && n.parent.name === n;
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
      (ts.isIdentifier(n) && n.text !== 'undefined' && !isPropertyName)
    ) {
      plain = false;
      return;
    }
    ts.forEachChild(n, visit);
  };
  visit(node);
  return plain;
}

/** "cfg?.cols", "this.columns()", "cfg().cols" -> ['cfg', 'cols']; anything else -> null */
function parseChain(raw) {
  const e = raw
    .replace(/\s+/g, '')
    .replace(/\(\)/g, '')
    .replace(/[?!]\./g, '.')
    .replace(/^this\./, '');
  return /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/.test(e) ? e.split('.') : null;
}

function formatKey(k) {
  return /^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`;
}

function formatValue(v) {
  if (typeof v === 'string') return `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  if (typeof v === 'object' && v !== null) return JSON.stringify(v);
  return String(v);
}

function buildArrayText(value, indent) {
  const lines = value.map((item) => {
    const { order, ...rest } = item; // the array position is the order
    const props = Object.entries(rest)
      .map(([k, v]) => `${formatKey(k)}: ${formatValue(v)}`)
      .join(', ');
    return `${indent}  { ${props} },`;
  });
  return `[\n${lines.join('\n')}\n${indent}]`;
}

/**
 * Plans the edit without touching any file.
 * Returns { ok: true, start, end, text } or { ok: false, reason }.
 */
function planArrayEdit(ts, fileName, sourceText, chain, value) {
  const sf = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.Latest, true);
  const name = chain.join('.');
  const arr = findArray(ts, sf, chain);
  if (!arr) {
    return {
      ok: false,
      reason: `no array found for "${name}" (use x = [...], x = signal([...]), a.b = [...] or a top-level const)`,
    };
  }
  if (!isPlain(ts, arr)) {
    return {
      ok: false,
      reason: `"${name}" contains calls, functions or references, so it is not safe to rewrite`,
    };
  }
  const start = arr.getStart(sf);
  const lineStart = sourceText.lastIndexOf('\n', start) + 1;
  const indent = sourceText.slice(lineStart).match(/^[ \t]*/)[0];
  return { ok: true, start, end: arr.getEnd(), text: buildArrayText(value, indent) };
}

module.exports = { parseChain, planArrayEdit, buildArrayText, formatValue };
