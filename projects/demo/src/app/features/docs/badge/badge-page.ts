import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<nd-badge variant="success" [dot]="true">Active</nd-badge>`;

const API: ApiRow[] = [
  { name: "variant", type: "'neutral' | 'primary' | 'success' | 'warning' | 'danger'", default: "'neutral'", description: "Colour." },
  { name: "dot", type: "boolean", default: "false", description: "Adds a status dot." },
  { name: "syncId", type: "string", default: "\u2014", description: "Lets the inspector write changes made in the browser into this template." },
];

@Component({
  selector: 'app-badge-page',
  imports: [Badge, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './badge-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgePage {
  readonly code = CODE;
  readonly api = API;
}
