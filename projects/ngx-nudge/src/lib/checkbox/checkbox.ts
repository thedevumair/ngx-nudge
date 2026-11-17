import { ChangeDetectionStrategy, Component } from '@angular/core';

/** <label><input type="checkbox" nd-checkbox /> Remember me</label> — works with ngModel and reactive forms. */
@Component({
  selector: 'input[type=checkbox][nd-checkbox]',
  template: '',
  styleUrl: './checkbox.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkbox {}
