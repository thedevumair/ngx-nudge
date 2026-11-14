'use strict';

const vscode = require('vscode');
const fs = require('fs');
const { EXCLUDE } = require('./constants');
const { planAttrEdit, planTextEdit } = require('./template');

async function applyProp(id, prop, value, kind, isDefault) {
  let reason = `no element with syncId="${id}" found in this workspace`;
  const files = await vscode.workspace.findFiles('**/*.{html,ts}', EXCLUDE);

  for (const uri of files) {
    if (!fs.readFileSync(uri.fsPath, 'utf8').includes(`syncId="${id}"`)) continue;

    const doc = await vscode.workspace.openTextDocument(uri); // also returns unsaved content
    const text = doc.getText();
    const plan =
      prop === '$text'
        ? planTextEdit(text, id, value)
        : planAttrEdit(text, id, prop, value, kind, isDefault);
    if (!plan) continue;
    if (!plan.ok) return { ok: false, reason: plan.reason };
    if (plan.start === plan.end && plan.text === '') return { ok: true }; // nothing to change

    const range = new vscode.Range(doc.positionAt(plan.start), doc.positionAt(plan.end));
    const edit = new vscode.WorkspaceEdit();
    edit.replace(uri, range, plan.text);
    await vscode.workspace.applyEdit(edit); // does not save

    const at = doc.positionAt(plan.start);
    await vscode.window.showTextDocument(doc, {
      preview: false,
      preserveFocus: true,
      selection: new vscode.Range(at, at),
    });
    return { ok: true };
  }
  return { ok: false, reason };
}

module.exports = { applyProp };
