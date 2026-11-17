import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Switch } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<label>
  <input type="checkbox" nd-switch [(ngModel)]="alerts" />
  Email alerts
</label>`;

const API: ApiRow[] = [
  { name: "checked", type: "native attribute", default: "false", description: "Initial state." },
  { name: "disabled", type: "native attribute", default: "false", description: "Blocks changes." },
  { name: "syncId", type: "string", default: "\u2014", description: "Lets the inspector write changes made in the browser into this template." },
];

@Component({
  selector: 'app-switch-page',
  imports: [Switch, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './switch-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchPage {
  readonly code = CODE;
  readonly api = API;
}
