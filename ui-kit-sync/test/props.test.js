'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { planAttrEdit, planTextEdit } = require('../src/template');

const apply = (src, plan) => src.slice(0, plan.start) + plan.text + src.slice(plan.end);

test('replaces an existing static attribute', () => {
  const src = `<button nd-button syncId="save" variant="solid">Save</button>`;
  const out = apply(src, planAttrEdit(src, 'save', 'variant', 'outline', 'select', false));
  assert.equal(out, `<button nd-button syncId="save" variant="outline">Save</button>`);
});

test('inserts a missing attribute before the end of the tag', () => {
  const src = `<nd-table syncId="t" [data]="rows()" />`;
  const out = apply(src, planAttrEdit(src, 't', 'pageSize', 5, 'number', false));
  assert.equal(out, `<nd-table syncId="t" [data]="rows()" [pageSize]="5" />`);
});

test('removes the attribute when the value is back to default', () => {
  const src = `<button nd-button syncId="save" variant="outline">Save</button>`;
  const out = apply(src, planAttrEdit(src, 'save', 'variant', 'solid', 'select', true));
  assert.equal(out, `<button nd-button syncId="save">Save</button>`);
});

test('keeps multi-line formatting', () => {
  const src = `<nd-grid\n  syncId="g"\n  [rowHeight]="80"\n/>`;
  const out = apply(src, planAttrEdit(src, 'g', 'rowHeight', 100, 'number', false));
  assert.equal(out, `<nd-grid\n  syncId="g"\n  [rowHeight]="100"\n/>`);
});

test('ignores the name inside another attribute value', () => {
  const src = `<button nd-button syncId="s" title="pick a variant here">Go</button>`;
  const out = apply(src, planAttrEdit(src, 's', 'variant', 'ghost', 'select', false));
  assert.equal(
    out,
    `<button nd-button syncId="s" title="pick a variant here" variant="ghost">Go</button>`,
  );
});

test('refuses to overwrite a non-literal binding', () => {
  const src = `<nd-table syncId="t" [pageSize]="settings.size" />`;
  const plan = planAttrEdit(src, 't', 'pageSize', 5, 'number', false);
  assert.equal(plan.ok, false);
  assert.match(plan.reason, /not a literal/);
});

test('returns null when the tag is not in the text', () => {
  assert.equal(planAttrEdit(`<p>hi</p>`, 'x', 'variant', 'a', 'select', false), null);
});

test('replaces plain text and keeps surrounding whitespace', () => {
  const src = `<button nd-button syncId="save">\n  Save\n</button>`;
  const out = apply(src, planTextEdit(src, 'save', 'Save changes'));
  assert.equal(out, `<button nd-button syncId="save">\n  Save changes\n</button>`);
});

test('refuses text with bindings or child elements', () => {
  assert.equal(planTextEdit(`<button syncId="a">{{ label }}</button>`, 'a', 'x').ok, false);
  assert.equal(planTextEdit(`<button syncId="a"><b>Hi</b></button>`, 'a', 'x').ok, false);
});

test('escapes characters that would break the template', () => {
  const src = `<nd-badge syncId="b">New</nd-badge>`;
  const out = apply(src, planTextEdit(src, 'b', 'a < b {x}'));
  assert.equal(out, `<nd-badge syncId="b">a &lt; b &#123;x&#125;</nd-badge>`);
});
