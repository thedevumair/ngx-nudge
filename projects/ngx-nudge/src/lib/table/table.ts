import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { syncToSource } from '../core/sync';
import { SortDir, moveColumn, pageCount, pageRows, sortRows } from './table-logic';

export interface Column {
  key: string;
  label?: string;
  width?: number;
  sortable?: boolean;
  order?: number;
}

const DEFAULT_WIDTH = 150;
const MIN_WIDTH = 40;

@Component({
  selector: 'nd-table',
  templateUrl: './table.html',
  styleUrl: './table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Table<T extends Record<string, any>> {
  data = input.required<T[]>();
  columns = input<(string | Column)[]>();
  pageSize = input(10);
  syncId = input<string>();

  /** Emits the new config whenever the layout changes. */
  columnsChange = output<Column[]>();

  sortKey = signal<string | null>(null);
  sortDir = signal<SortDir>('asc');
  page = signal(0);

  /** Source-of-truth layout: derived from the input, updated by resize and reorder. */
  layout = linkedSignal<Column[]>(() => {
    const raw = this.columns() ?? Object.keys(this.data()[0] ?? {});
    return raw
      .map((c, i) => {
        const col: Column = typeof c === 'string' ? { key: c } : c;
        return { ...col, order: col.order ?? i };
      })
      .sort((a, b) => a.order! - b.order!);
  });

  cols = computed(() =>
    this.layout().map((c) => ({
      key: c.key,
      label: c.label ?? c.key,
      width: c.width ?? DEFAULT_WIDTH,
      sortable: c.sortable ?? true,
    })),
  );

  totalWidth = computed(() => this.cols().reduce((sum, c) => sum + c.width, 0));
  sorted = computed(() => sortRows(this.data(), this.sortKey(), this.sortDir()));
  rows = computed(() => pageRows(this.sorted(), this.page(), this.pageSize()));
  totalPages = computed(() => pageCount(this.data().length, this.pageSize()));

  sortBy(key: string): void {
    if (this.sortKey() === key) {
      this.sortDir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
    this.page.set(0);
  }

  // ---------- Resize ----------
  resizing = signal(false);

  startResize(e: PointerEvent, key: string, th: HTMLElement): void {
    e.preventDefault();
    e.stopPropagation();
    const handle = e.target as HTMLElement;
    handle.setPointerCapture(e.pointerId);
    this.resizing.set(true);

    const startX = e.clientX;
    const startW = th.offsetWidth;

    const move = (ev: PointerEvent) => {
      const w = Math.max(MIN_WIDTH, Math.round(startW + ev.clientX - startX));
      this.layout.update((l) => l.map((c) => (c.key === key ? { ...c, width: w } : c)));
    };
    const up = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', up);
      this.resizing.set(false);
      this.emitLayout();
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', up);
  }

  // ---------- Reorder ----------
  dragKey = signal<string | null>(null);
  overKey = signal<string | null>(null);

  onDragStart(e: DragEvent, key: string): void {
    this.dragKey.set(key);
    e.dataTransfer?.setData('text/plain', key);
  }

  onDragOver(e: DragEvent, key: string): void {
    e.preventDefault();
    this.overKey.set(key);
  }

  onDrop(e: DragEvent, targetKey: string): void {
    e.preventDefault();
    const from = this.dragKey();
    this.dragKey.set(null);
    this.overKey.set(null);
    if (!from || from === targetKey) return;
    this.layout.update((l) => moveColumn(l, from, targetKey));
    this.emitLayout();
  }

  onDragEnd(): void {
    this.dragKey.set(null);
    this.overKey.set(null);
  }

  private emitLayout(): void {
    const cols = this.layout().map((c, i) => ({ ...c, order: i }));
    this.columnsChange.emit(cols);
    syncToSource(this.syncId(), 'columns', cols);
  }
}
