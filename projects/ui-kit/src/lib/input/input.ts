import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * <input ui-input placeholder="Name" />
 * <textarea ui-input></textarea>
 * Invalid state: aria-invalid="true"
 */
@Component({
  selector: 'input[ui-input], textarea[ui-input]',
  template: '<ng-content />',
  styleUrl: './input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInput {}
