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

module.exports = { findBinding, escapeRegExp };
