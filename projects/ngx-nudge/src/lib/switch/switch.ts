import { ChangeDetectionStrategy, Component } from '@angular/core';

/** <label><input type="checkbox" nd-switch /> Email alerts</label> */
@Component({
  selector: 'input[type=checkbox][nd-switch]',
  template: '',
  styleUrl: './switch.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'switch' },
})
export class Switch {}