import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Column, Table } from 'ngx-nudge';
import { UsersService } from '../../../core/services/users.service';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';

const CODE = `<nd-table syncId="my-table" [data]="users()" [columns]="userColumns" />

// Resize or reorder: the userColumns array
// updates itself in your file (unsaved).`;

@Component({
  selector: 'app-table-page',
  imports: [Table, DocPage, CodeBlock],
  templateUrl: './table-page.html',
  styleUrl: './table-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablePage {
  readonly users = inject(UsersService).users;
  readonly code = CODE;

  // Synced by the extension: keep it in this file.
  userColumns: Column[] = [
    { key: 'name', label: 'Name', width: 200 },
    { key: 'email', label: 'Email', width: 260 },
    { key: 'role', label: 'Role', width: 120 },
  ];
}
