import {
  Component,
  ElementRef,
  TemplateRef,
  computed,
  contentChild,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { syncToSource } from '../core/sync';

export interface GridItem {
  id: string;
  x: number; // column (0-based)
  y: number; // row (0-based)
  w: number; // width in columns
  h: number; // height in rows
}

@Component({
  selector: 'nd-grid',
  imports: [NgTemplateOutlet],
  templateUrl: './grid.html',
  styleUrl: './grid.css',
})
export class Grid {
  layout = input.required<GridItem[]>();
  cols = input(12);
  rowHeight = input(80);
  gap = input(8);
  syncId = input<string>();
  layoutChange = output<GridItem[]>();

  itemTpl = contentChild(TemplateRef);
  items = linkedSignal<GridItem[]>(() => this.layout().map((i) => ({ ...i })));
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  startDrag(e: PointerEvent, item: GridItem, mode: 'move' | 'resize') {
    e.preventDefault();
    e.stopPropagation();
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);

    const width = this.host.nativeElement.getBoundingClientRect().width;
    const stepX = (width + this.gap()) / this.cols();
    const stepY = this.rowHeight() + this.gap();
    const sx = e.clientX;
    const sy = e.clientY;
    const start = { ...item };
    const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

    const move = (ev: PointerEvent) => {
      const dx = Math.round((ev.clientX - sx) / stepX);
      const dy = Math.round((ev.clientY - sy) / stepY);
      this.items.update((list) =>
        list.map((i) => {
          if (i.id !== start.id) return i;
          return mode === 'move'
            ? { ...i, x: clamp(start.x + dx, 0, this.cols() - i.w), y: Math.max(0, start.y + dy) }
            : { ...i, w: clamp(start.w + dx, 1, this.cols() - i.x), h: Math.max(1, start.h + dy) };
        }),
      );
    };
    const up = () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      this.emit();
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  }

  private emit() {
    const value = this.items().map(({ id, x, y, w, h }) => ({ id, x, y, w, h }));
    this.layoutChange.emit(value);
    syncToSource(this.syncId(), 'layout', value);
  }
}
