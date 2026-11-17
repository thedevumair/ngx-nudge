// progress/progress.ts
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

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
    '[attr.aria-valuenow]': 'value()',
    '[class.indeterminate]': 'value() == null',
  },
})
export class Progress {
  value = input<number | null>(null);
  max = input(100);
  readonly percent = computed(() => {
    const v = this.value();
    return v == null ? null : Math.min(100, Math.max(0, (v / this.max()) * 100));
  });
}
