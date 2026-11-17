import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Select } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<select nd-select [(ngModel)]="role">
  <option value="admin">Admin</option>
  <option value="editor">Editor</option>
</select>`;

const API: ApiRow[] = [
  { name: "disabled", type: "native attribute", default: "\u2014", description: "Blocks selection." },
  { name: "aria-invalid", type: "'true'", default: "\u2014", description: "Shows the error state." },
];

@Component({
  selector: 'app-select-page',
  imports: [Select, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './select-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectPage {
  readonly code = CODE;
  readonly api = API;
}
