import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { overridable, registerInspectable } from '../core/inspect';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

const VARIANTS: readonly AlertVariant[] = ['info', 'success', 'warning', 'danger'];
const ICONS: Record<AlertVariant, string> = { info: 'i', success: '✓', warning: '!', danger: '!' };

/** <nd-alert variant="warning" title="Heads up">Your trial ends in 3 days.</nd-alert> */
@Component({
  selector: 'nd-alert',
  template: `
    <span class="icon" aria-hidden="true">{{ icon() }}</span>
    <div class="content">
      @if (titleValue()) {
        <strong class="title">{{ titleValue() }}</strong>
      }
      <div class="msg"><ng-content /></div>
    </div>
  `,
  styleUrl: './alert.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variantValue()',
    '[attr.role]': "variantValue() === 'danger' ? 'alert' : 'status'",
  },
})
export class Alert {
  variant = input<AlertVariant>('info');
  title = input<string>();
  syncId = input<string>();

  private readonly variantOv = overridable(this.variant);
  private readonly titleOv = overridable(this.title);
  protected readonly variantValue = this.variantOv.value;
  protected readonly titleValue = this.titleOv.value;
  readonly icon = computed(() => ICONS[this.variantValue()]);

  constructor() {
    registerInspectable({
      label: 'Alert',
      syncId: () => this.syncId(),
      props: [
        {
          name: 'variant',
          kind: 'select',
          options: VARIANTS,
          default: 'info',
          get: this.variantValue,
          set: (v) => this.variantOv.set(v as AlertVariant),
        },
        {
          name: 'title',
          kind: 'text',
          default: '',
          get: () => this.titleValue() ?? '',
          set: (v) => this.titleOv.set(String(v) || undefined),
        },
      ],
    });
  }
}
