'use strict';

const { parseChain } = require('./ast');

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Finds <nd-... syncId="id" [input]="expr"> in a template.
 * Returns { found: false } | { found: true, ok: false, reason } | { found: true, ok: true, chain }.
 */
function findBinding(text, id, inputName) {
  const tag = new RegExp(`<nd-[\\w-]+\\b[^>]*\\bsyncId="${escapeRegExp(id)}"[^>]*>`).exec(text);
  if (!tag) return { found: false };

  const bind = new RegExp(`\\[${escapeRegExp(inputName)}\\]\\s*=\\s*"([^"]+)"`).exec(tag[0]);
  if (!bind) return { found: true, ok: false, reason: `tag "${id}" has no [${inputName}] binding` };

  const chain = parseChain(bind[1]);
  if (!chain) {
    return {
      found: true,
      ok: false,
      reason: `binding "${bind[1]}" is not a plain property (use x, x(), or a.b)`,
    };
  }
  return { found: true, ok: true, chain };
}

/** Finds any tag (nd-*, button, a, ...) carrying syncId="id". */
function findTag(text, id) {
  const m = new RegExp(`<[A-Za-z][\\w-]*\\b[^>]*\\bsyncId="${escapeRegExp(id)}"[^>]*>`).exec(text);
  return m ? { start: m.index, tag: m[0] } : null;
}

function formatAttr(prop, value, kind) {
  if (kind === 'number' || kind === 'boolean') return `[${prop}]="${value}"`;
  return `${prop}="${String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`;
}

const LITERAL = /^\s*(-?\d+(\.\d+)?|true|false|'[^']*')\s*$/;

/**
 * Plans an attribute change on the tag with this syncId.
 * null: tag not in this text. { ok: false, reason }. { ok: true, start, end, text }.
 */
function planAttrEdit(text, id, prop, value, kind, isDefault) {
  const hit = findTag(text, id);
  if (!hit) return null;
  const { start, tag } = hit;

  // Walk real attributes so text inside other attribute values never matches
  const attrRe = /(\s+)([^\s=/>"']+)(?:\s*=\s*"([^"]*)")?/g;
  attrRe.lastIndex = tag.match(/^<[A-Za-z][\w-]*/)[0].length;
  let m;
  while ((m = attrRe.exec(tag))) {
    const [all, ws, name, val] = m;
    if (name !== prop && name !== `[${prop}]`) continue;
    if (name.startsWith('[') && val !== undefined && !LITERAL.test(val)) {
      return {
        ok: false,
        reason: `[${prop}] is bound to "${val}", which is not a literal, so it was left alone`,
      };
    }
    const attrStart = start + m.index;
    if (isDefault) return { ok: true, start: attrStart, end: attrStart + all.length, text: '' };
    return {
      ok: true,
      start: attrStart + ws.length,
      end: attrStart + all.length,
      text: formatAttr(prop, value, kind),
    };
  }

  if (isDefault) return { ok: true, start, end: start, text: '' }; // already default, nothing to write
  let at = tag.length - (tag.endsWith('/>') ? 2 : 1);
  while (at > 0 && /\s/.test(tag[at - 1])) at--;
  return {
    ok: true,
    start: start + at,
    end: start + at,
    text: ` ${formatAttr(prop, value, kind)}`,
  };
}

/** Plans a change to the plain text inside the tag with this syncId. */
function planTextEdit(text, id, value) {
  const hit = findTag(text, id);
  if (!hit) return null;
  if (hit.tag.endsWith('/>')) return { ok: false, reason: 'element has no text content' };

  const from = hit.start + hit.tag.length;
  const next = text.indexOf('<', from);
  if (next === -1 || text[next + 1] !== '/')
    return { ok: false, reason: 'element content is not plain text' };

  const inner = text.slice(from, next);
  if (/[{}]/.test(inner))
    return { ok: false, reason: 'element text uses bindings, so it was left alone' };

  const lead = inner.match(/^\s*/)[0];
  const trail = inner.trim() ? inner.match(/\s*$/)[0] : '';
  const safe = String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/{/g, '&#123;')
    .replace(/}/g, '&#125;');
  return { ok: true, start: from + lead.length, end: next - trail.length, text: safe };
}

module.exports = { findBinding, escapeRegExp, findTag, planAttrEdit, planTextEdit };