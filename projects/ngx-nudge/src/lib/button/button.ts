import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Usage:
 *   <button ui-button>Save</button>
 *   <button ui-button variant="outline" size="sm">Cancel</button>
 *   <a ui-button href="/home">Home</a>
 */
@Component({
  selector: 'button[ui-button], a[ui-button]',
  template: '<ng-content />',
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
  },
})
export class Button {
  variant = input<ButtonVariant>('solid');
  size = input<ButtonSize>('md');
}
