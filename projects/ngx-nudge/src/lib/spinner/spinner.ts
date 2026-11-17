import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { overridable, registerInspectable } from '../core/inspect';

export type SpinnerSize = 'sm' | 'md' | 'lg';

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
  host: { role: 'status', 'aria-label': 'Loading', '[attr.data-size]': 'sizeValue()' },
})
export class Spinner {
  size = input<SpinnerSize>('md');
  syncId = input<string>();

  private readonly sizeOv = overridable(this.size);
  protected readonly sizeValue = this.sizeOv.value;

  constructor() {
    registerInspectable({
      label: 'Spinner',
      syncId: () => this.syncId(),
      props: [
        {
          name: 'size',
          kind: 'select',
          options: ['sm', 'md', 'lg'],
          default: 'md',
          get: this.sizeValue,
          set: (v) => this.sizeOv.set(v as SpinnerSize),
        },
      ],
    });
  }
}
