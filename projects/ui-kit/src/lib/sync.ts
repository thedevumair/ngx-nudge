import { isDevMode } from '@angular/core';

const timers = new Map<string, ReturnType<typeof setTimeout>>();

// Dev mode mein, 400ms ruk kar VS Code extension ko naya value bhejta hai
export function syncToSource(id: string | undefined, prop: string, value: unknown) {
  if (!id || !isDevMode()) return;
  const key = `${id}:${prop}`;
  clearTimeout(timers.get(key));
  timers.set(
    key,
    setTimeout(() => {
      fetch('http://127.0.0.1:4567/columns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, prop, value }),
      }).catch(() => {});
    }, 400),
  );
}
