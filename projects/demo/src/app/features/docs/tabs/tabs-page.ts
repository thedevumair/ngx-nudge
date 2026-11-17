import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Tab, Tabs } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<nd-tabs [(selected)]="tab">
  <nd-tab label="Overview">...</nd-tab>
  <nd-tab label="Members">...</nd-tab>
</nd-tabs>`;

const API: ApiRow[] = [
  { name: "selected", type: "number (two-way)", default: "0", description: "Index of the open tab." },
  { name: "nd-tab label", type: "string", default: "required", description: "Tab title." },
  { name: "nd-tab disabled", type: "boolean", default: "false", description: "Makes the tab unselectable." },
];

@Component({
  selector: 'app-tabs-page',
  imports: [Tab, Tabs, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './tabs-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsPage {
  readonly code = CODE;
  readonly api = API;
  readonly tab = signal(0);
}
