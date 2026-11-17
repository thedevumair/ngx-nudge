import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { registerToggle } from '../../public-api';

/** <label><input type="radio" nd-radio name="plan" value="free" /> Free</label> */
@Component({
  selector: 'input[type=radio][nd-radio]',
  template: '',
  styleUrl: './radio.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Radio {
  syncId = input<string>();

  constructor() {
    registerToggle('Radio', () => this.syncId());
  }
}
