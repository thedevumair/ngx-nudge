'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const { planArrayEdit, parseChain } = require('../src/ast');

const VALUE = [{ key: 'name', width: 300, order: 0 }];

function apply(src, chain) {
  const plan = planArrayEdit(ts, 'x.ts', src, chain, VALUE);
  return plan.ok ? src.slice(0, plan.start) + plan.text + src.slice(plan.end) : plan;
}

test('rewrites a plain property array', () => {
  const out = apply(
    `class A {\n  columns: Column[] = [\n    { key: 'name', width: 200 },\n  ];\n}`,
    ['columns'],
  );
  assert.match(out, /width: 300/);
  assert.doesNotMatch(out, /order/);
});

test('rewrites the array inside signal()', () => {
  const out = apply(`class A { columns = signal<Column[]>([{ key: 'name', width: 200 }]); }`, [
    'columns',
  ]);
  assert.match(out, /signal<Column\[\]>\(\[/);
  assert.match(out, /width: 300/);
});

test('rewrites a nested array and keeps the rest of the object', () => {
  const out = apply(
    `class A { cfg = { title: 'x', cols: [{ key: 'name', width: 200 }] as Column[] }; }`,
    ['cfg', 'cols'],
  );
  assert.match(out, /title: 'x'/);
  assert.match(out, /as Column\[\]/);
  assert.match(out, /width: 300/);
});

test('follows a top-level const', () => {
  const out = apply(
    `const SHARED: Column[] = [{ key: 'name', width: 200 }];\nclass A { cols = SHARED; }`,
    ['cols'],
  );
  assert.match(out, /const SHARED: Column\[\] = \[\n/);
  assert.match(out, /width: 300/);
  assert.match(out, /cols = SHARED/);
});

test('refuses arrays with calls or references', () => {
  const plan = planArrayEdit(
    ts,
    'x.ts',
    `class A { columns = [{ key: 'name', header: this.t('x') }]; }`,
    ['columns'],
    VALUE,
  );
  assert.equal(plan.ok, false);
  assert.match(plan.reason, /not safe/);
});

test('explains when the array is missing', () => {
  const plan = planArrayEdit(ts, 'x.ts', `class A { other = []; }`, ['columns'], VALUE);
  assert.equal(plan.ok, false);
  assert.match(plan.reason, /no array found/);
});

test('parses template bindings', () => {
  assert.deepEqual(parseChain('cfg?.cols'), ['cfg', 'cols']);
  assert.deepEqual(parseChain('this.columns()'), ['columns']);
  assert.equal(parseChain('[1, 2]'), null);
});
