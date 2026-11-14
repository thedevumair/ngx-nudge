import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  isDevMode,
  signal,
} from '@angular/core';
import { Inspectable, InspectableProp, findInspectable } from '../core/inspect';
import { syncProp } from '../core/sync';

interface ColumnLike {
  key: string;
  label?: string;
  width?: number;
  sortable?: boolean;
  hidden?: boolean;
}

type ColumnField = 'label' | 'width' | 'sortable' | 'hidden';

/** Dev-only panel: click "Inspect", then click a component to edit its inputs live. */
@Component({
  selector: 'nd-inspector',
  template: `
    @if (dev) {
      @if (hover(); as r) {
        <div
          class="outline"
          [style.left.px]="r.left"
          [style.top.px]="r.top"
          [style.width.px]="r.width"
          [style.height.px]="r.height"
        ></div>
      }
      <div class="dock">
        @if (selected(); as item) {
          <div class="panel">
            <header>
              <strong>{{ item.label }}</strong>
              <button type="button" class="close" aria-label="Close" (click)="selected.set(null)">
                ×
              </button>
            </header>

            @if (item.syncId(); as id) {
              <p class="meta">
                syncId <code>{{ id }}</code
                >: changes are written to your code.
              </p>
            } @else {
              <p class="meta warn">
                Live only. Add <code>syncId="..."</code> to this element to write changes to code.
              </p>
            }

            @for (p of item.props; track p.name) {
              <div class="field" [class.wide]="p.kind === 'columns'">
                <span class="name">{{ p.name === '$text' ? 'Text' : p.name }}</span>
                @switch (p.kind) {
                  @case ('select') {
                    <select (change)="change(p, $any($event.target).value)">
                      @for (o of p.options; track o) {
                        <option [value]="o" [selected]="o === values()[p.name]">{{ o }}</option>
                      }
                    </select>
                  }
                  @case ('number') {
                    <input
                      type="number"
                      [value]="values()[p.name]"
                      (input)="change(p, $any($event.target).value)"
                    />
                  }
                  @case ('boolean') {
                    <input
                      type="checkbox"
                      [checked]="$any(values()[p.name])"
                      (change)="change(p, $any($event.target).checked)"
                    />
                  }
                  @case ('columns') {
                    <div class="cols">
                      @for (
                        c of columnsOf(p);
                        track c.key;
                        let i = $index, first = $first, last = $last
                      ) {
                        <div class="col" [class.off]="c.hidden">
                          <div class="col-head">
                            <code>{{ c.key }}</code>
                            <span class="moves">
                              <button
                                type="button"
                                aria-label="Move up"
                                [disabled]="first"
                                (click)="moveColumn(p, i, -1)"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                aria-label="Move down"
                                [disabled]="last"
                                (click)="moveColumn(p, i, 1)"
                              >
                                ↓
                              </button>
                            </span>
                          </div>
                          <input
                            type="text"
                            placeholder="Label"
                            [value]="c.label ?? ''"
                            (input)="editColumn(p, i, 'label', $any($event.target).value)"
                          />
                          <div class="col-row">
                            <input
                              type="number"
                              min="40"
                              aria-label="Width"
                              [value]="c.width ?? 150"
                              (input)="editColumn(p, i, 'width', $any($event.target).value)"
                            />
                            <label class="chk">
                              <input
                                type="checkbox"
                                [checked]="c.sortable !== false"
                                (change)="editColumn(p, i, 'sortable', $any($event.target).checked)"
                              />
                              sort
                            </label>
                            <label class="chk">
                              <input
                                type="checkbox"
                                [checked]="!c.hidden"
                                (change)="editColumn(p, i, 'hidden', !$any($event.target).checked)"
                              />
                              show
                            </label>
                          </div>
                        </div>
                      }
                    </div>
                  }
                  @default {
                    <input
                      type="text"
                      [value]="values()[p.name]"
                      (input)="change(p, $any($event.target).value)"
                    />
                  }
                }
              </div>
            }
          </div>
        }

        <button type="button" class="toggle" [class.on]="active()" (click)="toggle()">
          {{ active() ? 'Click a component (Esc to stop)' : 'Inspect' }}
        </button>
      </div>
    }
  `,
  styles: `
    .outline {
      position: fixed;
      z-index: 9998;
      pointer-events: none;
      border: 2px solid #4f46e5;
      border-radius: 4px;
      background: rgba(79, 70, 229, 0.08);
    }
    .dock {
      position: fixed;
      left: 16px;
      bottom: 16px;
      z-index: 9999;
      width: 320px;
      font:
        13px system-ui,
        sans-serif;
      color: #222;
    }
    .toggle {
      width: 100%;
      padding: 8px 12px;
      font: inherit;
      font-weight: 600;
      color: #fff;
      background: #1f2937;
      border: 0;
      border-radius: 8px;
      cursor: pointer;
    }
    .toggle.on {
      background: #4f46e5;
    }
    .panel {
      max-height: 70vh;
      overflow-y: auto;
      margin-bottom: 8px;
      padding: 12px;
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .close {
      font-size: 18px;
      line-height: 1;
      background: none;
      border: 0;
      cursor: pointer;
    }
    .meta {
      margin: 6px 0 10px;
      font-size: 12px;
      color: #555;
    }
    .meta.warn {
      color: #b45309;
    }
    code {
      padding: 1px 4px;
      background: #f3f4f6;
      border-radius: 4px;
    }
    .field {
      display: grid;
      grid-template-columns: 90px 1fr;
      align-items: center;
      gap: 8px;
      margin: 8px 0;
    }
    .field.wide {
      grid-template-columns: 1fr;
    }
    .name {
      font-weight: 600;
    }
    select,
    input[type='text'],
    input[type='number'] {
      width: 100%;
      box-sizing: border-box;
      padding: 4px 6px;
      font: inherit;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    .cols {
      display: grid;
      gap: 8px;
    }
    .col {
      display: grid;
      gap: 6px;
      padding: 8px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
    }
    .col.off {
      opacity: 0.5;
    }
    .col-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .moves button {
      width: 24px;
      margin-left: 4px;
      cursor: pointer;
    }
    .col-row {
      display: grid;
      grid-template-columns: 80px auto auto;
      align-items: center;
      gap: 8px;
    }
    .chk {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Inspector {
  readonly dev = isDevMode();
  readonly active = signal(false);
  readonly hover = signal<DOMRect | null>(null);
  readonly selected = signal<Inspectable | null>(null);
  readonly values = signal<Record<string, unknown>>({});

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  constructor() {
    if (!this.dev || typeof document === 'undefined') return;

    const inPanel = (t: EventTarget | null) => t instanceof Node && this.host.contains(t);

    const move = (e: PointerEvent) => {
      if (!this.active() || inPanel(e.target)) return;
      this.hover.set(findInspectable(e.target)?.element.getBoundingClientRect() ?? null);
    };
    // While inspecting, swallow presses so drag/resize/click handlers on the page do not run
    const block = (e: Event) => {
      if (!this.active() || inPanel(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
    };
    const click = (e: MouseEvent) => {
      if (!this.active() || inPanel(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      const item = findInspectable(e.target);
      if (item) this.select(item);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') this.stop();
    };

    document.addEventListener('pointermove', move, true);
    document.addEventListener('pointerdown', block, true);
    document.addEventListener('click', click, true);
    document.addEventListener('keydown', key);
    inject(DestroyRef).onDestroy(() => {
      document.removeEventListener('pointermove', move, true);
      document.removeEventListener('pointerdown', block, true);
      document.removeEventListener('click', click, true);
      document.removeEventListener('keydown', key);
    });
  }

  toggle(): void {
    if (this.active()) this.stop();
    else this.active.set(true);
  }

  stop(): void {
    this.active.set(false);
    this.hover.set(null);
  }

  select(item: Inspectable): void {
    this.selected.set(item);
    this.values.set(Object.fromEntries(item.props.map((p) => [p.name, p.get()])));
    this.stop();
  }

  columnsOf(p: InspectableProp): ColumnLike[] {
    return (this.values()[p.name] as ColumnLike[] | undefined) ?? [];
  }

  change(p: InspectableProp, raw: unknown): void {
    const value = p.kind === 'number' ? Number(raw) : raw;
    if (p.kind === 'number' && !Number.isFinite(value)) return;
    this.commit(p, value);
  }

  editColumn(p: InspectableProp, index: number, field: ColumnField, raw: unknown): void {
    const cols = [...this.columnsOf(p)];
    const next: ColumnLike = { ...cols[index] };

    if (field === 'width') {
      const w = Math.round(Number(raw));
      if (!Number.isFinite(w) || w < 40) return; // wait until the typed width is valid
      next.width = w;
    } else if (field === 'label') {
      const text = String(raw).trim();
      if (text) next.label = text;
      else delete next.label;
    } else {
      next[field] = !!raw;
    }

    cols[index] = next;
    this.commit(p, cols);
  }

  moveColumn(p: InspectableProp, index: number, dir: -1 | 1): void {
    const cols = [...this.columnsOf(p)];
    const to = index + dir;
    if (to < 0 || to >= cols.length) return;
    [cols[index], cols[to]] = [cols[to], cols[index]];
    this.commit(p, cols);
  }

  private commit(p: InspectableProp, value: unknown): void {
    p.set(value); // live on screen
    this.values.update((v) => ({ ...v, [p.name]: value }));

    const id = this.selected()?.syncId();
    if (id && !p.selfSync) syncProp(id, p.name, value, p.kind, value === p.default); // template edit (unsaved)
  }
}
