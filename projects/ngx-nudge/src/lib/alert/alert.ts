import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

const ICONS: Record<AlertVariant, string> = { info: 'i', success: '✓', warning: '!', danger: '!' };

/** <nd-alert variant="warning" title="Heads up">Your trial ends in 3 days.</nd-alert> */
@Component({
  selector: 'nd-alert',
  template: `
    <span class="icon" aria-hidden="true">{{ icon() }}</span>
    <div class="content">
      @if (title()) {
        <strong class="title">{{ title() }}</strong>
      }
      <div class="msg"><ng-content /></div>
    </div>
  `,
  styleUrl: './alert.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.role]': "variant() === 'danger' ? 'alert' : 'status'",
  },
})
export class Alert {
  variant = input<AlertVariant>('info');
  title = input<string>();
  readonly icon = computed(() => ICONS[this.variant()]);
}
