'use strict';

const { escapeRegExp } = require('./template');

/** Finds where the value of `--name: value;` sits. Returns { start, length } or null. */
function findTokenValue(text, name) {
  const m = new RegExp(`(${escapeRegExp(name)}\\s*:\\s*)([^;}]+)`).exec(text);
  if (!m) return null;
  const value = m[2].replace(/\s+$/, '');
  return { start: m.index + m[1].length, length: value.length };
}

/** Plans where new tokens go: inside an existing :root, or a new :root at the end. */
function planRootInsert(text, entries) {
  const lines = entries.map(([k, v]) => `  ${k}: ${v};`).join('\n');
  const root = /:root\s*\{/.exec(text);
  if (root) return { offset: root.index + root[0].length, text: `\n${lines}` };
  const sep = text.length && !text.endsWith('\n') ? '\n' : '';
  return { offset: text.length, text: `${sep}\n:root {\n${lines}\n}\n` };
}

module.exports = { findTokenValue, planRootInsert };
