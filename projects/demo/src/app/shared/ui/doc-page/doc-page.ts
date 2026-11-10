import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-doc-page',
  template: `
    <h1>{{ heading() }}</h1>
    @if (lead()) {
      <p class="lead">{{ lead() }}</p>
    }
    <div class="content"><ng-content /></div>
  `,
  styles: `
    h1 {
      margin: 0;
      font-size: 28px;
      letter-spacing: -0.02em;
    }
    .lead {
      max-width: 640px;
      margin: 8px 0 24px;
      line-height: 1.5;
      opacity: 0.7;
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocPage {
  heading = input.required<string>();
  lead = input<string>();
}
