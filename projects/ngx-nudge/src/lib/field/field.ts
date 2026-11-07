import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * <nd-field label="Email" hint="We will send a link" [required]="true">
 *   <input nd-input type="email" />
 * </nd-field>
 *
 * Error dikhane ke liye: error="Invalid email" aur control par aria-invalid="true".
 */
@Component({
  selector: 'nd-field',
  template: `
    <label class="field">
      <span class="label">
        {{ label() }}
        @if (required()) {
          <span class="req" aria-hidden="true">*</span>
        }
      </span>
      <ng-content />
    </label>
    @if (error()) {
      <p class="msg error" role="alert">{{ error() }}</p>
    } @else if (hint()) {
      <p class="msg">{{ hint() }}</p>
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
}
