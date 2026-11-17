import { ChangeDetectionStrategy, Component } from '@angular/core';

/** <label><input type="radio" nd-radio name="plan" value="free" /> Free</label> */
@Component({
  selector: 'input[type=radio][nd-radio]',
  template: '',
  styleUrl: './radio.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Radio {}
