import { ChangeDetectionStrategy, Component } from '@angular/core';

/** <select ui-select><option>Admin</option></select> */
@Component({
  selector: 'select[ui-select]',
  template: '<ng-content />', // options project hote hain, isliye zaroori
  styleUrl: './select.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Select {}
