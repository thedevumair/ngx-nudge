import { pageWindow } from './pagination-logic';

describe('pageWindow', () => {
  it('shows every page when there are 7 or fewer', () => {
    expect(pageWindow(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('collapses the end near the start', () => {
    expect(pageWindow(2, 24)).toEqual([1, 2, 3, 4, 5, '…', 24]);
  });

  it('collapses both sides in the middle', () => {
    expect(pageWindow(10, 24)).toEqual([1, '…', 9, 10, 11, '…', 24]);
  });

  it('collapses the start near the end', () => {
    expect(pageWindow(23, 24)).toEqual([1, '…', 20, 21, 22, 23, 24]);
  });
});
