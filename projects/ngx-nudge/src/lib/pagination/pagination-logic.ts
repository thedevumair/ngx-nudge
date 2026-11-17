export type PageItem = number | '…';

const range = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

/** Page numbers to show, always at most 7 slots: 1 … 4 5 6 … 24 */
export function pageWindow(current: number, count: number): PageItem[] {
  if (count <= 7) return range(1, count);
  if (current <= 4) return [...range(1, 5), '…', count];
  if (current >= count - 3) return [1, '…', ...range(count - 4, count)];
  return [1, '…', current - 1, current, current + 1, '…', count];
}
