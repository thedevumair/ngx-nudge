import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Radio } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<label><input type="radio" nd-radio name="plan" value="free" [(ngModel)]="plan" /> Free</label>
<label><input type="radio" nd-radio name="plan" value="pro" [(ngModel)]="plan" /> Pro</label>`;

const API: ApiRow[] = [
  { name: "name", type: "native attribute", default: "\u2014", description: "Groups the radios." },
  { name: "checked", type: "native attribute", default: "false", description: "Initial selection." },
  { name: "disabled", type: "native attribute", default: "false", description: "Blocks selection." },
  { name: "syncId", type: "string", default: "\u2014", description: "Lets the inspector write changes made in the browser into this template." },
];

@Component({
  selector: 'app-radio-page',
  imports: [Radio, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './radio-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioPage {
  readonly code = CODE;
  readonly api = API;
}
