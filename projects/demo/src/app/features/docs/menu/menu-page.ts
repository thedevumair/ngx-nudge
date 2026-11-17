import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button, Menu, MenuItem, MenuTrigger, ToastService } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<button nd-button [ndMenuTrigger]="actions">Actions</button>
<nd-menu #actions>
  <button type="button" nd-menu-item (click)="rename()">Rename</button>
  <button type="button" nd-menu-item variant="danger">Delete</button>
</nd-menu>`;

const API: ApiRow[] = [
  { name: "ndMenuTrigger", type: "Menu", default: "required", description: "The menu this button opens." },
  { name: "nd-menu label", type: "string", default: "'Menu'", description: "Accessible name of the menu." },
  { name: "nd-menu-item variant", type: "'default' | 'danger'", default: "'default'", description: "Item colour." },
];

@Component({
  selector: 'app-menu-page',
  imports: [Button, Menu, MenuItem, MenuTrigger, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './menu-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuPage {
  readonly code = CODE;
  readonly api = API;
  private readonly toast = inject(ToastService);

  action(name: string): void {
    this.toast.show({ title: name, message: 'Menu item clicked.' });
  }
}
