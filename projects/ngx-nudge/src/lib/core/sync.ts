import { isDevMode } from '@angular/core';

const SYNC_URL = 'http://127.0.0.1:4567';
const DEBOUNCE_MS = { source: 400, tokens: 500 } as const;

const timers = new Map<string, ReturnType<typeof setTimeout>>();
const tokenBuffer: Record<string, string> = {};

function post(path: string, body: unknown): void {
  fetch(`${SYNC_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(() => {}); // extension na chal rahi ho to chup rahe
}

function debounce(key: string, ms: number, fn: () => void): void {
  clearTimeout(timers.get(key));
  timers.set(key, setTimeout(fn, ms));
}

/** Component ka config (columns, layout...) developer ki source file mein likhwata hai. Sirf dev mode. */
export function syncToSource(id: string | undefined, prop: string, value: unknown): void {
  if (!id || !isDevMode()) return;
  debounce(`${id}:${prop}`, DEBOUNCE_MS.source, () => post('/columns', { id, prop, value }));
}

/** CSS variables ko developer ki scss/css file mein likhwata hai. Sirf dev mode. */
export function syncTokens(tokens: Record<string, string>): void {
  if (!isDevMode()) return;
  Object.assign(tokenBuffer, tokens);
  debounce('tokens', DEBOUNCE_MS.tokens, () => {
    const payload = { ...tokenBuffer };
    for (const key of Object.keys(tokenBuffer)) delete tokenBuffer[key];
    post('/tokens', { tokens: payload });
  });
}
