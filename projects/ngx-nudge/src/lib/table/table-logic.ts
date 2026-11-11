export type SortDir = 'asc' | 'desc';

/** Compares two cell values: nulls last, numbers numerically, text with numeric awareness. */
export function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

/** Returns a sorted copy; the input is never mutated. */
export function sortRows<T extends Record<string, unknown>>(
  rows: readonly T[],
  key: string | null,
  dir: SortDir,
): T[] {
  const copy = [...rows];
  if (!key) return copy;
  const sign = dir === 'asc' ? 1 : -1;
  return copy.sort((a, b) => compareValues(a[key], b[key]) * sign);
}

export function pageRows<T>(rows: readonly T[], page: number, size: number): T[] {
  const start = page * size;
  return rows.slice(start, start + size);
}

export function pageCount(total: number, size: number): number {
  return Math.max(1, Math.ceil(total / Math.max(1, size)));
}

/** Moves the column `fromKey` to the position of `toKey` and renumbers `order`. */
export function moveColumn<C extends { key: string }>(
  cols: readonly C[],
  fromKey: string,
  toKey: string,
): (C & { order: number })[] {
  const list = [...cols];
  const from = list.findIndex((c) => c.key === fromKey);
  const to = list.findIndex((c) => c.key === toKey);
  if (from === -1 || to === -1 || from === to) return list.map((c, i) => ({ ...c, order: i }));
  const [moved] = list.splice(from, 1);
  list.splice(to, 0, moved);
  return list.map((c, i) => ({ ...c, order: i }));
}
