import { Column, GridItem, TableDensity } from 'ngx-nudge';
import { CodeLine, CodeToken, line, tk } from '../../shared/ui/code-window/code-line';

const str = (v: string) => tk(`'${v}'`, 'str');
const num = (v: number) => tk(String(v), 'num');

function objectLine(entries: [string, CodeToken][]): CodeLine {
  const parts: CodeToken[] = [tk('    { ', 'punc')];
  entries.forEach(([key, value], i) => {
    if (i) parts.push(tk(', ', 'punc'));
    parts.push(tk(key, 'prop'), tk(': ', 'punc'), value);
  });
  parts.push(tk(' },', 'punc'));
  return line(...parts);
}

export function tsColumnLines(cols: readonly Column[]): CodeLine[] {
  return [
    line(
      tk('  '),
      tk('userColumns', 'prop'),
      tk(': ', 'punc'),
      tk('Column', 'kw'),
      tk('[] = [', 'punc'),
    ),
    ...cols.map((c) => {
      const entries: [string, CodeToken][] = [['key', str(c.key)]];
      if (c.label) entries.push(['label', str(c.label)]);
      entries.push(['width', num(c.width ?? 150)]);
      if (c.sortable === false) entries.push(['sortable', tk('false', 'kw')]);
      if (c.hidden) entries.push(['hidden', tk('true', 'kw')]);
      return objectLine(entries);
    }),
    line(tk('  ];', 'punc')),
  ];
}

export function boardLines(items: readonly GridItem[]): CodeLine[] {
  return [
    line(
      tk('  '),
      tk('board', 'prop'),
      tk(': ', 'punc'),
      tk('GridItem', 'kw'),
      tk('[] = [', 'punc'),
    ),
    ...items.map((it) =>
      objectLine([
        ['id', str(it.id)],
        ['x', num(it.x)],
        ['y', num(it.y)],
        ['w', num(it.w)],
        ['h', num(it.h)],
      ]),
    ),
    line(tk('  ];', 'punc')),
  ];
}

const attr = (name: string, value: string) =>
  line(tk('  '), tk(name, 'attr'), tk('=', 'punc'), tk(`"${value}"`, 'str'));

export function tableHtmlLines(density: TableDensity, striped: boolean): CodeLine[] {
  return [
    line(tk('<nd-table', 'tag')),
    attr('[data]', 'team'),
    attr('[columns]', 'userColumns'),
    ...(density !== 'normal' ? [attr('density', density)] : []),
    ...(striped ? [] : [attr('[striped]', 'false')]),
    line(tk('/>', 'tag')),
  ];
}

export function scssLines(vars: Record<string, string>): CodeLine[] {
  return [
    line(tk(':root', 'tag'), tk(' {', 'punc')),
    ...Object.entries(vars).map(([k, v]) =>
      line(tk('  '), tk(k, 'prop'), tk(': ', 'punc'), tk(v, 'num'), tk(';', 'punc')),
    ),
    line(tk('}', 'punc')),
  ];
}
