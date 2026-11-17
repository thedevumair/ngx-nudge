import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { registerToggle } from '../../public-api';

/** <label><input type="checkbox" nd-switch /> Email alerts</label> */
@Component({
  selector: 'input[type=checkbox][nd-switch]',
  template: '',
  styleUrl: './switch.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'switch' },
})
export class Switch {
  syncId = input<string>();

  constructor() {
    registerToggle('Switch', () => this.syncId());
  }
}
