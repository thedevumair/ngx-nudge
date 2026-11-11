export interface GridItem {
  id: string;
  x: number; // column (0-based)
  y: number; // row (0-based)
  w: number; // width in columns
  h: number; // height in rows
}

export const clamp = (v: number, min: number, max: number): number =>
  Math.min(Math.max(v, min), max);

/** Moves an item by whole cells and keeps it inside the grid's columns. */
export function moveItem(start: GridItem, dx: number, dy: number, cols: number): GridItem {
  return {
    ...start,
    x: clamp(start.x + dx, 0, cols - start.w),
    y: Math.max(0, start.y + dy),
  };
}

/** Resizes an item by whole cells; at least 1x1, never past the last column. */
export function resizeItem(start: GridItem, dx: number, dy: number, cols: number): GridItem {
  return {
    ...start,
    w: clamp(start.w + dx, 1, cols - start.x),
    h: Math.max(1, start.h + dy),
  };
}
