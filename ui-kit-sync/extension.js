const vscode = require("vscode");
const http = require("http");

let server;

function activate(context) {
  server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }
    if (req.method !== "POST" || req.url !== "/columns") {
      res.writeHead(404);
      return res.end();
    }

    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const { id, columns } = JSON.parse(body);
        const ok = await applyColumns(id, columns);
        res.writeHead(ok ? 200 : 404);
        res.end(ok ? "ok" : "marker not found");
      } catch (e) {
        res.writeHead(500);
        res.end(String(e));
      }
    });
  });

  server.listen(4567, "127.0.0.1");
  vscode.window.setStatusBarMessage("UI Kit Sync: listening on 4567", 5000);
  context.subscriptions.push({ dispose: () => server && server.close() });
}

async function applyColumns(id, columns) {
  const marker = `// @ui-table ${id}`;
  const files = await vscode.workspace.findFiles(
    "**/*.ts",
    "**/node_modules/**",
  );

  for (const uri of files) {
    const doc = await vscode.workspace.openTextDocument(uri);
    const text = doc.getText();
    const m = text.indexOf(marker);
    if (m === -1) continue;

    const eq = /=\s*\[/.exec(text.slice(m));
    if (!eq) continue;
    const start = m + eq.index + eq[0].length - 1;

    let depth = 0,
      end = -1;
    for (let i = start; i < text.length; i++) {
      if (text[i] === "[") depth++;
      else if (text[i] === "]") {
        depth--;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    if (end === -1) continue;

    const lineStart = text.lastIndexOf("\n", m) + 1;
    const indent = text.slice(lineStart, m).match(/^\s*/)[0];

    const lines = columns.map((c) => {
      const { order, ...rest } = c;
      const props = Object.entries(rest)
        .map(([k, v]) => `${k}: ${typeof v === "string" ? `'${v}'` : v}`)
        .join(", ");
      return `${indent}  { ${props} },`;
    });
    const newText = `[\n${lines.join("\n")}\n${indent}]`;

    const edit = new vscode.WorkspaceEdit();
    edit.replace(
      uri,
      new vscode.Range(doc.positionAt(start), doc.positionAt(end + 1)),
      newText,
    );
    await vscode.workspace.applyEdit(edit);
    await vscode.window.showTextDocument(doc, {
      preview: false,
      preserveFocus: true,
    });
    return true;
  }
  return false;
}

function deactivate() {
  if (server) server.close();
}

module.exports = { activate, deactivate };
