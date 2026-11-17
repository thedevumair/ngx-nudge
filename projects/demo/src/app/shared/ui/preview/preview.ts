import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Framed area that shows live examples on a docs page. */
@Component({
  selector: 'app-preview',
  template: `
    <div class="bar">
      <span>{{ title() }}</span>
      <span class="hint">Inspect to edit</span>
    </div>
    <div class="stage" [class.stack]="stack()"><ng-content /></div>
  `,
  styleUrl: './preview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Preview {
  title = input('Preview');
  /** Lays the examples out in a column instead of a row. */
  stack = input(false);
}
