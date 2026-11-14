'use strict';

const vscode = require('vscode');
const { EXCLUDE } = require('./constants');
const { findTokenValue, planRootInsert } = require('./css');

async function applyTokens(tokens) {
  const files = await vscode.workspace.findFiles('**/*.{scss,css}', EXCLUDE);
  const edit = new vscode.WorkspaceEdit();
  const pending = new Map(Object.entries(tokens));

  // 1) Where the variable already exists, update its value in place
  for (const uri of files) {
    if (!pending.size) break;
    const doc = await vscode.workspace.openTextDocument(uri);
    const text = doc.getText();
    for (const [name, value] of [...pending]) {
      const hit = findTokenValue(text, name);
      if (!hit) continue;
      edit.replace(
        uri,
        new vscode.Range(doc.positionAt(hit.start), doc.positionAt(hit.start + hit.length)),
        value,
      );
      pending.delete(name);
    }
  }

  // 2) Anything not found goes into the global styles file's :root
  if (pending.size) {
    const globals = await vscode.workspace.findFiles('**/styles.{scss,css}', EXCLUDE, 1);
    if (!globals.length)
      return { ok: false, reason: 'no styles.scss or styles.css found for new tokens' };
    const doc = await vscode.workspace.openTextDocument(globals[0]);
    const plan = planRootInsert(doc.getText(), [...pending]);
    edit.insert(globals[0], doc.positionAt(plan.offset), plan.text);
  }

  await vscode.workspace.applyEdit(edit); // does not save
  vscode.window.setStatusBarMessage('Nudge Sync: styles updated (unsaved)', 2500);
  return { ok: true };
}

module.exports = { applyTokens };
