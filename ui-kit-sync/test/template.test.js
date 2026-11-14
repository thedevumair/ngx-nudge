'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { findBinding } = require('../src/template');

test('finds the bound property', () => {
  const html = `<nd-table syncId="orders" [data]="rows()" [columns]="orderColumns" />`;
  assert.deepEqual(findBinding(html, 'orders', 'columns'), {
    found: true,
    ok: true,
    chain: ['orderColumns'],
  });
});

test('ignores other ids and non-nd tags', () => {
  assert.deepEqual(findBinding(`<nd-table syncId="team" [columns]="x" />`, 'orders', 'columns'), {
    found: false,
  });
  assert.deepEqual(findBinding(`<ui-table syncId="orders" [columns]="x" />`, 'orders', 'columns'), {
    found: false,
  });
});

test('reports a missing binding', () => {
  const r = findBinding(`<nd-grid syncId="board" [rowHeight]="70" />`, 'board', 'layout');
  assert.equal(r.ok, false);
  assert.match(r.reason, /no \[layout\] binding/);
});
