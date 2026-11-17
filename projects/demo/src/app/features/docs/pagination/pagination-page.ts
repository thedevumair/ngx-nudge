import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Pagination } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<nd-pagination [total]="240" [pageSize]="10" [(page)]="page" />`;

const API: ApiRow[] = [
  { name: "total", type: "number", default: "required", description: "Number of items." },
  { name: "pageSize", type: "number", default: "10", description: "Items per page." },
  { name: "page", type: "number (two-way, 1-based)", default: "1", description: "Current page." },
  { name: "syncId", type: "string", default: "\u2014", description: "Lets the inspector write changes made in the browser into this template." },
];

@Component({
  selector: 'app-pagination-page',
  imports: [Pagination, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './pagination-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationPage {
  readonly code = CODE;
  readonly api = API;
  readonly page = signal(5);
}
