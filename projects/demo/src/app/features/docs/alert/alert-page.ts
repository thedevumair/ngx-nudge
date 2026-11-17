import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Alert } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<nd-alert variant="warning" title="Trial ending">
  Your trial ends in 3 days.
</nd-alert>`;

const API: ApiRow[] = [
  { name: "variant", type: "'info' | 'success' | 'warning' | 'danger'", default: "'info'", description: "Colour and icon." },
  { name: "title", type: "string", default: "\u2014", description: "Bold first line." },
  { name: "syncId", type: "string", default: "\u2014", description: "Lets the inspector write changes made in the browser into this template." },
];

@Component({
  selector: 'app-alert-page',
  imports: [Alert, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './alert-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertPage {
  readonly code = CODE;
  readonly api = API;
}
