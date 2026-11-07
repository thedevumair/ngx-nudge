import { ChangeDetectionStrategy, Component } from '@angular/core';

/** <select nd-select><option>Admin</option></select> */
@Component({
  selector: 'select[nd-select]',
  template: '<ng-content />', // options project hote hain, isliye zaroori
  styleUrl: './select.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Select {}
