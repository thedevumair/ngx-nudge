import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Spinner } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<nd-spinner size="sm" />`;

const API: ApiRow[] = [
  { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Diameter." },
  { name: "syncId", type: "string", default: "\u2014", description: "Lets the inspector write changes made in the browser into this template." },
];

@Component({
  selector: 'app-spinner-page',
  imports: [Spinner, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './spinner-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerPage {
  readonly code = CODE;
  readonly api = API;
}
