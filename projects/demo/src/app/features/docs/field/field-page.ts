import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Field, TextInput } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<nd-field label="Email" hint="We never share it." [required]="true">
  <input nd-input type="email" />
</nd-field>

<nd-field label="Website" error="Enter a valid URL">
  <input nd-input aria-invalid="true" />
</nd-field>`;

const API: ApiRow[] = [
  { name: "label", type: "string", default: "required", description: "Text above the control." },
  { name: "hint", type: "string", default: "\u2014", description: "Helper text below the control." },
  { name: "error", type: "string", default: "\u2014", description: "Replaces the hint with an error message." },
  { name: "required", type: "boolean", default: "false", description: "Shows a red asterisk." },
  { name: "syncId", type: "string", default: "\u2014", description: "Lets the inspector write changes made in the browser into this template." },
];

@Component({
  selector: 'app-field-page',
  imports: [Field, TextInput, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './field-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldPage {
  readonly code = CODE;
  readonly api = API;
}
