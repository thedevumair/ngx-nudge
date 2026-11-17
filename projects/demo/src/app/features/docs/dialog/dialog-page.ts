import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button, Dialog, DialogSize } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<nd-dialog [(open)]="open" size="sm">
  <h3 ndDialogTitle>Delete project?</h3>
  This cannot be undone.
  <div ndDialogActions>
    <button nd-button variant="danger">Delete</button>
  </div>
</nd-dialog>`;

const API: ApiRow[] = [
  { name: "open", type: "boolean (two-way)", default: "false", description: "Shows or hides the dialog." },
  { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Maximum width." },
  { name: "closable", type: "boolean", default: "true", description: "Shows the close button." },
];

@Component({
  selector: 'app-dialog-page',
  imports: [Button, Dialog, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './dialog-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogPage {
  readonly code = CODE;
  readonly api = API;
  readonly open = signal(false);
  readonly size = signal<DialogSize>('md');

  show(size: DialogSize): void {
    this.size.set(size);
    this.open.set(true);
  }
}
