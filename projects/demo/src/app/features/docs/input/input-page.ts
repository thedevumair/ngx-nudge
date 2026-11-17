import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TextInput } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<input nd-input placeholder="Your name" />
<input nd-input type="date" />
<input nd-input aria-invalid="true" />
<textarea nd-input placeholder="Message"></textarea>`;

const API: ApiRow[] = [
  { name: "placeholder", type: "native attribute", default: "\u2014", description: "Hint text shown while empty." },
  { name: "aria-invalid", type: "'true'", default: "\u2014", description: "Shows the error state." },
  { name: "disabled", type: "native attribute", default: "\u2014", description: "Blocks input." },
  { name: "syncId", type: "string", default: "\u2014", description: "Lets the inspector write changes made in the browser into this template." },
];

@Component({
  selector: 'app-input-page',
  imports: [TextInput, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './input-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPage {
  readonly code = CODE;
  readonly api = API;
}
