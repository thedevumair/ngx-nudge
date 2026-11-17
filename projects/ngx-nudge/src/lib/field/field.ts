import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { overridable, registerInspectable } from '../core/inspect';

/**
 * <nd-field label="Email" hint="We will send a link" [required]="true">
 *   <input nd-input type="email" />
 * </nd-field>
 * To show an error: error="Invalid email" and aria-invalid="true" on the control.
 */
@Component({
  selector: 'nd-field',
  template: `
    <label class="field">
      <span class="label">
        {{ labelValue() }}
        @if (requiredValue()) {
          <span class="req" aria-hidden="true">*</span>
        }
      </span>
      <ng-content />
    </label>
    @if (errorValue()) {
      <p class="msg error" role="alert">
        <span class="ic" aria-hidden="true">!</span>{{ errorValue() }}
      </p>
    } @else if (hintValue()) {
      <p class="msg">{{ hintValue() }}</p>
    }
  `,
  styleUrl: './field.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Field {
  label = input.required<string>();
  hint = input<string>();
  error = input<string>();
  required = input(false);
  syncId = input<string>();

  private readonly labelOv = overridable(this.label);
  private readonly hintOv = overridable(this.hint);
  private readonly errorOv = overridable(this.error);
  private readonly requiredOv = overridable(this.required);
  protected readonly labelValue = this.labelOv.value;
  protected readonly hintValue = this.hintOv.value;
  protected readonly errorValue = this.errorOv.value;
  protected readonly requiredValue = this.requiredOv.value;

  constructor() {
    registerInspectable({
      label: 'Field',
      syncId: () => this.syncId(),
      props: [
        {
          name: 'label',
          kind: 'text',
          default: undefined,
          get: this.labelValue,
          set: (v) => this.labelOv.set(String(v)),
        },
        {
          name: 'hint',
          kind: 'text',
          default: '',
          get: () => this.hintValue() ?? '',
          set: (v) => this.hintOv.set(String(v) || undefined),
        },
        {
          name: 'error',
          kind: 'text',
          default: '',
          get: () => this.errorValue() ?? '',
          set: (v) => this.errorOv.set(String(v) || undefined),
        },
        {
          name: 'required',
          kind: 'boolean',
          default: false,
          get: this.requiredValue,
          set: (v) => this.requiredOv.set(!!v),
        },
      ],
    });
  }
}
