import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button, Dialog } from 'ngx-nudge';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';

const CODE = `<nd-dialog [(open)]="show">
  <h3 ndDialogTitle>Delete user?</h3>
  This cannot be undone.
  <div ndDialogActions>
    <button nd-button size="sm">Delete</button>
  </div>
</nd-dialog>`;

@Component({
  selector: 'app-dialog-page',
  imports: [Button, Dialog, DocPage, CodeBlock],
  templateUrl: './dialog-page.html',
  styleUrl: './dialog-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogPage {
  readonly code = CODE;
  readonly open = signal(false);
}
