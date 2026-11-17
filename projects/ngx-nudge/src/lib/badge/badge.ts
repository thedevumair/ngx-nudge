import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { overridable, registerInspectable } from '../core/inspect';

export type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

const VARIANTS: readonly BadgeVariant[] = ['neutral', 'primary', 'success', 'warning', 'danger'];

/** <nd-badge variant="success">Active</nd-badge> */
@Component({
  selector: 'nd-badge',
  template: '<ng-content />',
  styleUrl: './badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-variant]': 'variantValue()', '[class.dot]': 'dot()' },
})
export class Badge {
  variant = input<BadgeVariant>('neutral');
  syncId = input<string>();
  dot = input(false);

  private readonly variantOv = overridable(this.variant);
  protected readonly variantValue = this.variantOv.value;

  constructor() {
    registerInspectable({
      label: 'Badge',
      syncId: () => this.syncId(),
      text: true,
      props: [
        {
          name: 'variant',
          kind: 'select',
          options: VARIANTS,
          default: 'neutral',
          get: this.variantValue,
          set: (v) => this.variantOv.set(v as BadgeVariant),
        },
      ],
    });
  }
}
