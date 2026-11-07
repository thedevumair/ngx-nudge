import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

/** <nd-badge variant="success">Active</nd-badge> */
@Component({
  selector: 'nd-badge',
  template: '<ng-content />',
  styleUrl: './badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-variant]': 'variant()' },
})
export class Badge {
  variant = input<BadgeVariant>('neutral');
}
