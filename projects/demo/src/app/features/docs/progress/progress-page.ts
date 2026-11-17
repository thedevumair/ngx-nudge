import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button, Progress } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<nd-progress [value]="64" />
<nd-progress />  <!-- unknown progress -->`;

const API: ApiRow[] = [
  { name: "value", type: "number | null", default: "null", description: "Current value; null shows the animated bar." },
  { name: "max", type: "number", default: "100", description: "Value at 100%." },
  { name: "syncId", type: "string", default: "\u2014", description: "Lets the inspector write changes made in the browser into this template." },
];

@Component({
  selector: 'app-progress-page',
  imports: [Button, Progress, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './progress-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressPage {
  readonly code = CODE;
  readonly api = API;
  readonly value = signal(40);

  step(by: number): void {
    this.value.update((v) => Math.min(100, Math.max(0, v + by)));
  }
}
