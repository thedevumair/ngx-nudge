'use strict';

const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { EXCLUDE } = require('./constants');
const { findBinding } = require('./template');
const { planArrayEdit } = require('./ast');

async function applyColumns(ts, id, inputName, value) {
  let reason = `no <nd-...> tag with syncId="${id}" found in this workspace`;
  const files = await vscode.workspace.findFiles('**/*.{ts,html}', EXCLUDE);

  for (const uri of files) {
    const text = fs.readFileSync(uri.fsPath, 'utf8');
    const binding = findBinding(text, id, inputName);
    if (!binding.found) continue;
    if (!binding.ok) {
      reason = binding.reason;
      continue;
    }

    // inline template: same .ts file; external template: the .ts file with the same name
    const ownerPath = uri.fsPath.endsWith('.html')
      ? uri.fsPath.replace(/\.html$/, '.ts')
      : uri.fsPath;
    if (!fs.existsSync(ownerPath)) {
      reason = `no .ts file next to ${path.basename(uri.fsPath)}`;
      continue;
    }

    const ownerUri = vscode.Uri.file(ownerPath);
    const doc = await vscode.workspace.openTextDocument(ownerUri); // also returns unsaved content
    const plan = planArrayEdit(ts, ownerPath, doc.getText(), binding.chain, value);
    if (!plan.ok) {
      reason = `${plan.reason} in ${path.basename(ownerPath)}`;
      continue;
    }

    const edit = new vscode.WorkspaceEdit();
    edit.replace(
      ownerUri,
      new vscode.Range(doc.positionAt(plan.start), doc.positionAt(plan.end)),
      plan.text,
    );
    await vscode.workspace.applyEdit(edit); // does not save
    await vscode.window.showTextDocument(doc, { preview: false, preserveFocus: true });
    return { ok: true };
  }
  return { ok: false, reason };
}

module.exports = { applyColumns };
