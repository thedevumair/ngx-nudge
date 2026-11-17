// spinner/spinner.ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** <nd-spinner /> */
@Component({
  selector: 'nd-spinner',
  template: '',
  styles: `
    :host {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2.5px solid color-mix(in srgb, var(--nd-color-primary, #4f46e5) 20%, transparent);
      border-top-color: var(--nd-color-primary, #4f46e5);
      border-radius: 50%;
      animation: nd-spin 0.75s linear infinite;
    }
    :host([data-size='sm']) {
      width: 14px;
      height: 14px;
      border-width: 2px;
    }
    :host([data-size='lg']) {
      width: 32px;
      height: 32px;
      border-width: 3px;
    }
    @keyframes nd-spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'status', 'aria-label': 'Loading', '[attr.data-size]': 'size()' },
})
export class Spinner {
  size = input<'sm' | 'md' | 'lg'>('md');
}
