import { isDevMode } from '@angular/core';

const SYNC_HOST = 'http://127.0.0.1';
const PORTS = [4567, 4568, 4569, 4570, 4571];
let lastPort: number | undefined;
const DEBOUNCE_MS = { source: 400, tokens: 500 } as const;

const timers = new Map<string, ReturnType<typeof setTimeout>>();
const tokenBuffer: Record<string, string> = {};

/** Tries each extension port until one window accepts the change (200). */
async function post(path: string, body: unknown): Promise<void> {
  const payload = JSON.stringify(body);
  const order = lastPort ? [lastPort, ...PORTS.filter((p) => p !== lastPort)] : PORTS;
  for (const port of order) {
    try {
      const res = await fetch(`${SYNC_HOST}:${port}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });
      if (res.ok) {
        lastPort = port;
        return;
      }
    } catch {
      // port closed, try the next one
    }
  }
}

function debounce(key: string, ms: number, fn: () => void): void {
  clearTimeout(timers.get(key));
  timers.set(key, setTimeout(fn, ms));
}

/** Writes a component's config (columns, layout, ...) into the developer's source file. Dev mode only. */
export function syncToSource(id: string | undefined, prop: string, value: unknown): void {
  if (!id || !isDevMode()) return;
  debounce(`${id}:${prop}`, DEBOUNCE_MS.source, () => post('/columns', { id, prop, value }));
}

/** Writes CSS variables into the developer's scss/css file. Dev mode only. */
export function syncTokens(tokens: Record<string, string>): void {
  if (!isDevMode()) return;
  Object.assign(tokenBuffer, tokens);
  debounce('tokens', DEBOUNCE_MS.tokens, () => {
    const payload = { ...tokenBuffer };
    for (const key of Object.keys(tokenBuffer)) delete tokenBuffer[key];
    post('/tokens', { tokens: payload });
  });
}

/** Writes one input (or the text, prop '$text') of a template element. Dev mode only. */
export function syncProp(
  id: string,
  prop: string,
  value: unknown,
  kind: string,
  isDefault: boolean,
): void {
  if (!isDevMode()) return;
  debounce(`${id}:prop:${prop}`, 400, () => post('/props', { id, prop, value, kind, isDefault }));
}
