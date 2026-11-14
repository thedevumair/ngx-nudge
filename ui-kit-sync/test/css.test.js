'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { findTokenValue, planRootInsert } = require('../src/css');

test('finds a token value', () => {
  const css = ':root {\n  --nd-radius: 6px;\n}';
  const hit = findTokenValue(css, '--nd-radius');
  assert.equal(css.substr(hit.start, hit.length), '6px');
});

test('ignores usages and longer names', () => {
  const css = 'a { border-radius: var(--nd-radius); }\n:root { --nd-radius-lg: 12px; }';
  assert.equal(findTokenValue(css, '--nd-radius'), null);
});

test('inserts into an existing :root', () => {
  const css = ':root {\n  --a: 1px;\n}';
  const plan = planRootInsert(css, [['--nd-radius', '8px']]);
  const out = css.slice(0, plan.offset) + plan.text + css.slice(plan.offset);
  assert.match(out, /:root \{\n {2}--nd-radius: 8px;\n {2}--a: 1px;/);
});

test('creates :root when missing', () => {
  const plan = planRootInsert('body { margin: 0; }', [['--nd-radius', '8px']]);
  assert.match(plan.text, /:root \{\n {2}--nd-radius: 8px;\n\}/);
});
