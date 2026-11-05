import { Component, isDevMode, signal } from '@angular/core';
import { syncTokens } from '../core/sync';

export interface ThemeToken {
  group: string;
  name: string;
  label: string;
  type: 'color' | 'px';
  default: string;
  min?: number;
  max?: number;
}

export const TOKENS: ThemeToken[] = [
  // Global: ye badlo to poori kit badle
  {
    group: 'Global',
    name: '--ui-color-primary',
    label: 'Primary colour',
    type: 'color',
    default: '#3b5bdb',
  },
  {
    group: 'Global',
    name: '--ui-color-surface',
    label: 'Surface',
    type: 'color',
    default: '#ffffff',
  },
  { group: 'Global', name: '--ui-color-text', label: 'Text', type: 'color', default: '#222222' },
  {
    group: 'Global',
    name: '--ui-color-border',
    label: 'Border',
    type: 'color',
    default: '#dddddd',
  },
  {
    group: 'Global',
    name: '--ui-radius',
    label: 'Corner radius',
    type: 'px',
    default: '6px',
    min: 0,
    max: 24,
  },
  {
    group: 'Global',
    name: '--ui-font-size',
    label: 'Font size',
    type: 'px',
    default: '14px',
    min: 10,
    max: 22,
  },

  // Button
  {
    group: 'Button',
    name: '--ui-button-pad-y',
    label: 'Padding vertical',
    type: 'px',
    default: '8px',
    min: 0,
    max: 24,
  },
  {
    group: 'Button',
    name: '--ui-button-pad-x',
    label: 'Padding horizontal',
    type: 'px',
    default: '16px',
    min: 0,
    max: 40,
  },

  // Card
  {
    group: 'Card',
    name: '--ui-card-pad',
    label: 'Padding',
    type: 'px',
    default: '16px',
    min: 0,
    max: 40,
  },

  // Table
  {
    group: 'Table',
    name: '--ui-table-header-bg',
    label: 'Header background',
    type: 'color',
    default: '#f5f5f5',
  },
  {
    group: 'Table',
    name: '--ui-table-header-color',
    label: 'Header text',
    type: 'color',
    default: '#222222',
  },
  {
    group: 'Table',
    name: '--ui-table-stripe-bg',
    label: 'Row stripe',
    type: 'color',
    default: '#fafafa',
  },
  {
    group: 'Table',
    name: '--ui-table-pad-y',
    label: 'Padding vertical',
    type: 'px',
    default: '8px',
    min: 0,
    max: 32,
  },
  {
    group: 'Table',
    name: '--ui-table-pad-x',
    label: 'Padding horizontal',
    type: 'px',
    default: '12px',
    min: 0,
    max: 32,
  },
];

@Component({
  selector: 'ui-theme-panel',
  template: `
    @if (dev) {
      <div class="panel">
        <button type="button" class="toggle" (click)="open.set(!open())">Theme</button>
        @if (open()) {
          <div class="list">
            @for (t of tokens; track t.name; let i = $index) {
              @if (i === 0 || tokens[i - 1].group !== t.group) {
                <h4>{{ t.group }}</h4>
              }
              <label>
                <span>{{ t.label }}</span>
                @if (t.type === 'color') {
                  <input
                    type="color"
                    [value]="values()[t.name]"
                    (input)="set(t, $any($event.target).value)"
                  />
                } @else {
                  <input
                    type="range"
                    [min]="t.min"
                    [max]="t.max"
                    [value]="px(values()[t.name])"
                    (input)="set(t, $any($event.target).value + 'px')"
                  />
                  <em>{{ values()[t.name] }}</em>
                }
              </label>
            }
          </div>
        }
      </div>
    }
  `,
  styles: [
    `
      .panel {
        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 9999;
        width: 260px;
        padding: 12px;
        background: #fff;
        color: #222;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        font: 13px sans-serif;
      }
      .toggle {
        width: 100%;
        cursor: pointer;
      }
      .list {
        max-height: 60vh;
        overflow-y: auto;
        margin-top: 8px;
      }
      h4 {
        margin: 12px 0 4px;
        font-size: 12px;
        text-transform: uppercase;
        color: #666;
      }
      label {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        gap: 4px 8px;
        margin: 6px 0;
      }
      label input[type='range'] {
        grid-column: 1 / 2;
      }
      em {
        font-style: normal;
        color: #666;
      }
    `,
  ],
})
export class ThemePanel {
  dev = isDevMode();
  tokens = TOKENS;
  open = signal(true);
  values = signal<Record<string, string>>(this.read());

  private read() {
    const cs = getComputedStyle(document.documentElement);
    const out: Record<string, string> = {};
    for (const t of TOKENS) {
      const raw = cs.getPropertyValue(t.name).trim();
      out[t.name] = t.type === 'color' ? this.hex(raw, t.default) : raw || t.default;
    }
    return out;
  }

  private hex(v: string, fallback: string) {
    if (/^#[0-9a-f]{6}$/i.test(v)) return v;
    const m = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(v);
    return m ? `#${m[1]}${m[1]}${m[2]}${m[2]}${m[3]}${m[3]}` : fallback;
  }

  px(v: string) {
    return parseInt(v, 10) || 0;
  }

  set(t: ThemeToken, value: string) {
    document.documentElement.style.setProperty(t.name, value); // foran screen par
    this.values.update((v) => ({ ...v, [t.name]: value }));
    syncTokens({ [t.name]: value }); // aur scss file mein (debounced)
  }
}
