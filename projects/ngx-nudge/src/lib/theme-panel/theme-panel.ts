import { ChangeDetectionStrategy, Component, isDevMode, signal } from '@angular/core';
import { syncTokens } from '../core/sync';
import { TOKENS, ThemeToken } from '../core/tokens';

@Component({
  selector: 'nd-theme-panel',
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
  host: { '(window:nd-theme-change)': 'refresh()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePanel {
  dev = isDevMode();
  tokens = TOKENS;
  open = signal(false);
  values = signal<Record<string, string>>(this.read());

  refresh() {
    this.values.set(this.read());
  }

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
    document.documentElement.style.setProperty(t.name, value); // apply to the screen immediately
    this.values.update((v) => ({ ...v, [t.name]: value }));
    syncTokens({ [t.name]: value }); // and write to the scss file (debounced)
  }
}
