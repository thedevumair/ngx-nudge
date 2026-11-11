import { GridItem, moveItem, resizeItem } from './grid-logic';

describe('grid-logic', () => {
  const item: GridItem = { id: 'a', x: 2, y: 1, w: 4, h: 2 };

  it('moves by whole cells', () => {
    expect(moveItem(item, 3, 1, 12)).toEqual({ id: 'a', x: 5, y: 2, w: 4, h: 2 });
  });

  it('never moves past the left edge or the last column', () => {
    expect(moveItem(item, -10, 0, 12).x).toBe(0);
    expect(moveItem(item, 20, 0, 12).x).toBe(8); // 12 - w
  });

  it('never moves above the first row', () => {
    expect(moveItem(item, 0, -5, 12).y).toBe(0);
  });

  it('resizes but stays at least 1x1 and inside the grid', () => {
    expect(resizeItem(item, -10, -10, 12)).toEqual({ id: 'a', x: 2, y: 1, w: 1, h: 1 });
    expect(resizeItem(item, 20, 0, 12).w).toBe(10); // 12 - x
  });
});
