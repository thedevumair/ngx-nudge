'use strict';

const http = require('http');
const { PORTS } = require('./constants');

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

/**
 * routes: { '/columns': async (data) => ({ ok, reason }), ... }
 * onStatus(text, warn) is called whenever the server state changes.
 */
function createSyncServer(routes, onStatus) {
  let server;

  async function handle(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }

    const route = req.method === 'POST' && routes[req.url];
    if (!route) {
      res.writeHead(404);
      return res.end();
    }

    try {
      const result = await route(JSON.parse(await readBody(req)));
      // 404 means "not in this window's workspace"; the library tries the next port
      res.writeHead(result.ok ? 200 : 404);
      res.end(result.ok ? 'ok' : result.reason || 'target not found');
    } catch (e) {
      res.writeHead(500);
      res.end(String(e && e.message ? e.message : e));
    }
  }

  function listen(i) {
    if (i >= PORTS.length) {
      onStatus(`no free port (${PORTS[0]}-${PORTS[PORTS.length - 1]})`, true);
      return;
    }
    const s = http.createServer(handle);
    s.once('error', (e) => {
      if (e.code === 'EADDRINUSE') listen(i + 1);
      else onStatus(String(e), true);
    });
    s.listen(PORTS[i], '127.0.0.1', () => {
      server = s;
      onStatus(`ON (${PORTS[i]})`, false);
    });
  }

  return {
    start() {
      if (!server) listen(0);
    },
    stop() {
      if (server) server.close();
      server = undefined;
    },
  };
}

module.exports = { createSyncServer };
