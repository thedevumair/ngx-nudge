import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

/** <ui-badge variant="success">Active</ui-badge> */
@Component({
  selector: 'ui-badge',
  template: '<ng-content />',
  styleUrl: './badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-variant]': 'variant()' },
})
export class Badge {
  variant = input<BadgeVariant>('neutral');
}
