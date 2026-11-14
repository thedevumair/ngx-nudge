import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { overridable, registerInspectable } from '../core/inspect';

export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: readonly ButtonVariant[] = ['solid', 'outline', 'ghost'];
const SIZES: readonly ButtonSize[] = ['sm', 'md', 'lg'];

/**
 * Usage:
 *   <button nd-button>Save</button>
 *   <button nd-button variant="outline" size="sm">Cancel</button>
 *   <a nd-button href="/home">Home</a>
 */
@Component({
  selector: 'button[nd-button], a[nd-button]',
  template: '<ng-content />',
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variantValue()',
    '[attr.data-size]': 'sizeValue()',
  },
})
export class Button {
  variant = input<ButtonVariant>('solid');
  size = input<ButtonSize>('md');
  syncId = input<string>();

  private readonly variantOv = overridable(this.variant);
  private readonly sizeOv = overridable(this.size);
  protected readonly variantValue = this.variantOv.value;
  protected readonly sizeValue = this.sizeOv.value;

  constructor() {
    registerInspectable({
      label: 'Button',
      syncId: () => this.syncId(),
      text: true,
      props: [
        {
          name: 'variant',
          kind: 'select',
          options: VARIANTS,
          default: 'solid',
          get: this.variantValue,
          set: (v) => this.variantOv.set(v as ButtonVariant),
        },
        {
          name: 'size',
          kind: 'select',
          options: SIZES,
          default: 'md',
          get: this.sizeValue,
          set: (v) => this.sizeOv.set(v as ButtonSize),
        },
      ],
    });
  }
}
