/** Options that start with the query come first, then ones that contain it. */
export function filterOptions(options: readonly string[], query: string, limit = 8): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return options.slice(0, limit);
  const starts: string[] = [];
  const contains: string[] = [];
  for (const o of options) {
    const i = o.toLowerCase().indexOf(q);
    if (i === 0) starts.push(o);
    else if (i > 0) contains.push(o);
  }
  return [...starts, ...contains].slice(0, limit);
}

/** Splits a label around the first match, for highlighting: [before, match, after]. */
export function splitMatch(label: string, query: string): [string, string, string] {
  const q = query.trim();
  const i = q ? label.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return [label, '', ''];
  return [label.slice(0, i), label.slice(i, i + q.length), label.slice(i + q.length)];
}
