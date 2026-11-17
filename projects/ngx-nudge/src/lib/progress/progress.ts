import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { overridable, registerInspectable } from '../core/inspect';

/** <nd-progress [value]="64" />, or with no value for an indeterminate bar. */
@Component({
  selector: 'nd-progress',
  template: '<span class="fill" [style.width.%]="percent() ?? 35"></span>',
  styles: `
    :host {
      display: block;
      height: 8px;
      overflow: hidden;
      background: color-mix(in srgb, var(--nd-color-primary, #4f46e5) 14%, transparent);
      border-radius: 999px;
    }
    .fill {
      display: block;
      height: 100%;
      background: var(--nd-color-primary, #4f46e5);
      border-radius: inherit;
      transition: width 0.3s ease;
    }
    :host(.indeterminate) .fill {
      animation: nd-slide 1.2s ease-in-out infinite;
    }
    @keyframes nd-slide {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(300%);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'progressbar',
    'aria-valuemin': '0',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'valueOf()',
    '[class.indeterminate]': 'valueOf() == null',
  },
})
export class Progress {
  value = input<number | null>(null);
  max = input(100);
  syncId = input<string>();

  private readonly valueOv = overridable(this.value);
  protected readonly valueOf = this.valueOv.value;

  readonly percent = computed(() => {
    const v = this.valueOf();
    return v == null ? null : Math.min(100, Math.max(0, (v / this.max()) * 100));
  });

  constructor() {
    registerInspectable({
      label: 'Progress',
      syncId: () => this.syncId(),
      props: [
        {
          name: 'value',
          kind: 'number',
          default: null,
          get: this.valueOf,
          set: (v) => this.valueOv.set(Number(v)),
        },
      ],
    });
  }
}
