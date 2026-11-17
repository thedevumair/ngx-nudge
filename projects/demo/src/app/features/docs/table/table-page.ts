import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Column, Table } from 'ngx-nudge';
import { UsersService } from '../../../core/services/users.service';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<nd-table syncId="my-table" [data]="users()" [columns]="userColumns" />

// Resize or reorder a column: the userColumns array
// updates itself in your file (unsaved).`;

const API: ApiRow[] = [
  { name: "data", type: "T[]", default: "required", description: "Rows to show." },
  { name: "columns", type: "(string | Column)[]", default: "keys of the first row", description: "Column order, labels, widths, sortable, hidden." },
  { name: "pageSize", type: "number", default: "10", description: "Rows per page." },
  { name: "pager", type: "boolean", default: "true", description: "Shows the page controls." },
  { name: "striped", type: "boolean", default: "true", description: "Alternate row colour." },
  { name: "density", type: "'compact' | 'normal' | 'comfortable'", default: "'normal'", description: "Row height." },
  { name: "columnsChange", type: "output Column[]", default: "—", description: "Emits after a resize or reorder." },
  { name: "syncId", type: "string", default: "—", description: "Writes column changes into the bound array, and inspector changes into the template." },
];

@Component({
  selector: 'app-table-page',
  imports: [Table, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './table-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablePage {
  readonly users = inject(UsersService).users;
  readonly code = CODE;
  readonly api = API;

  // Synced by the extension: keep it in this file.
  userColumns: Column[] = [
    { key: 'name', label: 'Name', width: 200 },
    { key: 'email', label: 'Email', width: 260 },
    { key: 'role', label: 'Role', width: 120 },
  ];
}
