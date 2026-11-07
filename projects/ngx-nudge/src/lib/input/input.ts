import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * <input nd-input placeholder="Name" />
 * <textarea nd-input></textarea>
 * Invalid state: aria-invalid="true"
 */
@Component({
  selector: 'input[nd-input], textarea[nd-input]',
  template: '<ng-content />',
  styleUrl: './input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInput {}
