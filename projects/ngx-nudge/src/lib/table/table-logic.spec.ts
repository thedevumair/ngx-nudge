import { compareValues, moveColumn, pageCount, pageRows, sortRows } from './table-logic';

describe('table-logic', () => {
  const rows = [
    { name: 'Sara', amount: 10 },
    { name: 'Ali', amount: 2 },
    { name: 'Hamza', amount: null },
  ];

  it('sorts text ascending and descending', () => {
    expect(sortRows(rows, 'name', 'asc').map((r) => r.name)).toEqual(['Ali', 'Hamza', 'Sara']);
    expect(sortRows(rows, 'name', 'desc').map((r) => r.name)).toEqual(['Sara', 'Hamza', 'Ali']);
  });

  it('sorts numbers numerically and puts nulls last', () => {
    expect(sortRows(rows, 'amount', 'asc').map((r) => r.amount)).toEqual([2, 10, null]);
  });

  it('does not mutate the input', () => {
    const copy = [...rows];
    sortRows(rows, 'name', 'asc');
    expect(rows).toEqual(copy);
  });

  it('returns 0 for equal values and sorts numeric text naturally', () => {
    expect(compareValues('a', 'a')).toBe(0);
    expect(compareValues('Item 2', 'Item 10')).toBeLessThan(0);
  });

  it('paginates', () => {
    const list = [1, 2, 3, 4, 5];
    expect(pageRows(list, 0, 2)).toEqual([1, 2]);
    expect(pageRows(list, 2, 2)).toEqual([5]);
    expect(pageCount(5, 2)).toBe(3);
    expect(pageCount(0, 10)).toBe(1);
  });

  it('moves a column and renumbers order', () => {
    const cols = [{ key: 'a' }, { key: 'b' }, { key: 'c' }];
    expect(moveColumn(cols, 'c', 'a')).toEqual([
      { key: 'c', order: 0 },
      { key: 'a', order: 1 },
      { key: 'b', order: 2 },
    ]);
  });
});
