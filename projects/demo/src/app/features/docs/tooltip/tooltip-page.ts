import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Tooltip } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<button nd-button ndTooltip="Copies the link">Share</button>`;

const API: ApiRow[] = [
  { name: "ndTooltip", type: "string", default: "required", description: "Tooltip text." },
  { name: "ndTooltipPlacement", type: "'top' | 'bottom'", default: "'top'", description: "Preferred side; flips when there is no room." },
];

@Component({
  selector: 'app-tooltip-page',
  imports: [Button, Tooltip, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './tooltip-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipPage {
  readonly code = CODE;
  readonly api = API;
}
