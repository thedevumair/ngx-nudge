import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { registerToggle } from '../../public-api';

/** <label><input type="checkbox" nd-checkbox /> Remember me</label> — works with ngModel and reactive forms. */
@Component({
  selector: 'input[type=checkbox][nd-checkbox]',
  template: '',
  styleUrl: './checkbox.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkbox {
  syncId = input<string>();

  constructor() {
    registerToggle('Checkbox', () => this.syncId());
  }
}
