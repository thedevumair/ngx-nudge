import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<button nd-button>Save</button>
<button nd-button variant="outline" size="sm">Cancel</button>
<button nd-button variant="danger">Delete</button>
<button nd-button [loading]="saving()">Save</button>
<a nd-button href="/pricing">Pricing</a>`;

const API: ApiRow[] = [
  { name: "variant", type: "'solid' | 'soft' | 'outline' | 'ghost' | 'danger'", default: "'solid'", description: "Visual style." },
  { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Height and padding." },
  { name: "loading", type: "boolean", default: "false", description: "Shows a spinner and blocks clicks." },
  { name: "disabled", type: "native attribute", default: "\u2014", description: "Dims the button and blocks clicks." },
  { name: "syncId", type: "string", default: "\u2014", description: "Lets the inspector write changes made in the browser into this template." },
];

@Component({
  selector: 'app-button-page',
  imports: [Button, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './button-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonPage {
  readonly code = CODE;
  readonly api = API;
  readonly saving = signal(false);

  save(): void {
    this.saving.set(true);
    setTimeout(() => this.saving.set(false), 1200);
  }
}
