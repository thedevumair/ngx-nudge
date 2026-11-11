import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  contentChild,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { syncToSource } from '../core/sync';
import { GridItem, moveItem, resizeItem } from './grid-logic';

export type { GridItem } from './grid-logic';

@Component({
  selector: 'nd-grid',
  imports: [NgTemplateOutlet],
  templateUrl: './grid.html',
  styleUrl: './grid.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  startDrag(e: PointerEvent, item: GridItem, mode: 'move' | 'resize'): void {
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
    const apply = mode === 'move' ? moveItem : resizeItem;

    const move = (ev: PointerEvent) => {
      const dx = Math.round((ev.clientX - sx) / stepX);
      const dy = Math.round((ev.clientY - sy) / stepY);
      const next = apply(start, dx, dy, this.cols());
      this.items.update((list) => list.map((i) => (i.id === start.id ? next : i)));
    };
    const up = () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      this.emit();
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  }

  private emit(): void {
    const value = this.items().map(({ id, x, y, w, h }) => ({ id, x, y, w, h }));
    this.layoutChange.emit(value);
    syncToSource(this.syncId(), 'layout', value);
  }
}
