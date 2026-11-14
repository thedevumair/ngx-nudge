'use strict';

const vscode = require('vscode');
const path = require('path');
const { createSyncServer } = require('./src/server');
const { applyColumns } = require('./src/columns');
const { applyTokens } = require('./src/tokens');

let sync;
let statusItem;

function setStatus(text, warn) {
  statusItem.text = `$(${warn ? 'warning' : 'check'}) Nudge Sync: ${text}`;
  statusItem.backgroundColor = warn
    ? new vscode.ThemeColor('statusBarItem.warningBackground')
    : undefined;
  statusItem.show();
}

/** Uses the project's own TypeScript so parsing matches the code being edited. */
function loadTs() {
  const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!root) throw new Error('No workspace folder open');
  try {
    return require(path.join(root, 'node_modules', 'typescript'));
  } catch {
    throw new Error('TypeScript not found in this workspace (run npm install)');
  }
}

function activate(context) {
  statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
  context.subscriptions.push(statusItem);

  sync = createSyncServer(
    {
      '/columns': (d) => applyColumns(loadTs(), d.id, d.prop ?? 'columns', d.value ?? d.columns),
      '/tokens': (d) => applyTokens(d.tokens),
    },
    setStatus,
  );

  if (vscode.workspace.isTrusted) {
    sync.start();
  } else {
    setStatus('OFF - trust this folder to enable', true);
    context.subscriptions.push(vscode.workspace.onDidGrantWorkspaceTrust(() => sync.start()));
  }
  context.subscriptions.push({ dispose: () => sync.stop() });
}

function deactivate() {
  if (sync) sync.stop();
}

module.exports = { activate, deactivate };
