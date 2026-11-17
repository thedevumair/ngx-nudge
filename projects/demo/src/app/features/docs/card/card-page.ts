import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Card } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<nd-card>
  <h3 ndCardHeader>Team plan</h3>
  Up to 10 members.
  <div ndCardFooter><button nd-button size="sm">Upgrade</button></div>
</nd-card>`;

const API: ApiRow[] = [
  { name: "[ndCardHeader]", type: "slot", default: "\u2014", description: "Content shown as the header." },
  { name: "[ndCardFooter]", type: "slot", default: "\u2014", description: "Content shown in the footer bar." },
  { name: "--nd-card-pad", type: "CSS variable", default: "20px", description: "Inner padding." },
  { name: "--nd-card-radius", type: "CSS variable", default: "radius + 4px", description: "Corner radius." },
];

@Component({
  selector: 'app-card-page',
  imports: [Button, Card, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './card-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPage {
  readonly code = CODE;
  readonly api = API;
}
