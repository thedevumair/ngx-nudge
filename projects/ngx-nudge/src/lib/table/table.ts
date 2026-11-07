import { Component, computed, input, isDevMode, linkedSignal, output, signal } from '@angular/core';
import { syncToSource } from '../core/sync';
export interface Column {
  key: string;
  label?: string;
  width?: number;
  sortable?: boolean;
  order?: number;
}

@Component({
  selector: 'ui-table',
  imports: [],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table<T extends Record<string, any>> {
  data = input.required<T[]>();
  columns = input<(string | Column)[]>();
  pageSize = input(10);
  syncId = input<string>();

  // Layout badalne par naya config bahar nikalta hai
  columnsChange = output<Column[]>();

  sortKey = signal<string | null>(null);
  sortDir = signal<'asc' | 'desc'>('asc');
  page = signal(0);

  // Asal layout state: input se banti hai, resize/reorder se badalti hai
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
      width: c.width ?? 150,
      sortable: c.sortable ?? true,
    })),
  );

  totalWidth = computed(() => this.cols().reduce((sum, c) => sum + c.width, 0));

  sorted = computed(() => {
    const key = this.sortKey();
    const rows = [...this.data()];
    if (!key) return rows;
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    return rows.sort((a, b) => (a[key] > b[key] ? dir : -dir));
  });

  rows = computed(() => {
    const start = this.page() * this.pageSize();
    return this.sorted().slice(start, start + this.pageSize());
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.data().length / this.pageSize())));

  sortBy(key: string) {
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

  startResize(e: PointerEvent, key: string, th: HTMLElement) {
    e.preventDefault();
    e.stopPropagation();
    const handle = e.target as HTMLElement;
    handle.setPointerCapture(e.pointerId);
    this.resizing.set(true);

    const startX = e.clientX;
    const startW = th.offsetWidth;

    const move = (ev: PointerEvent) => {
      const w = Math.max(40, Math.round(startW + ev.clientX - startX));
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

  onDragStart(e: DragEvent, key: string) {
    this.dragKey.set(key);
    e.dataTransfer?.setData('text/plain', key);
  }

  onDragOver(e: DragEvent, key: string) {
    e.preventDefault();
    this.overKey.set(key);
  }

  onDrop(e: DragEvent, targetKey: string) {
    e.preventDefault();
    const from = this.dragKey();
    this.dragKey.set(null);
    this.overKey.set(null);
    if (!from || from === targetKey) return;

    this.layout.update((l) => {
      const list = [...l];
      const fromIdx = list.findIndex((c) => c.key === from);
      const toIdx = list.findIndex((c) => c.key === targetKey);
      const [moved] = list.splice(fromIdx, 1);
      list.splice(toIdx, 0, moved);
      return list.map((c, i) => ({ ...c, order: i }));
    });
    this.emitLayout();
  }

  onDragEnd() {
    this.dragKey.set(null);
    this.overKey.set(null);
  }

  private emitLayout() {
    const cols = this.layout().map((c, i) => ({ ...c, order: i }));
    this.columnsChange.emit(cols);
    syncToSource(this.syncId(), 'columns', cols);
  }
}
