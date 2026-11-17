import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Grid, GridItem } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<nd-grid syncId="my-board" [layout]="board">
  <ng-template let-w>{{ w.id }}</ng-template>
</nd-grid>

// Drag or resize a widget: the board array updates itself.`;

const API: ApiRow[] = [
  { name: "layout", type: "GridItem[]", default: "required", description: "Widgets with id, x, y, w, h." },
  { name: "cols", type: "number", default: "12", description: "Columns in the grid." },
  { name: "rowHeight", type: "number", default: "80", description: "Row height in pixels." },
  { name: "gap", type: "number", default: "8", description: "Space between widgets in pixels." },
  { name: "layoutChange", type: "output GridItem[]", default: "—", description: "Emits after a drag or resize." },
  { name: "syncId", type: "string", default: "—", description: "Writes layout changes into the bound array." },
];

@Component({
  selector: 'app-grid-page',
  imports: [Grid, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './grid-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridPage {
  readonly code = CODE;
  readonly api = API;

  // Synced by the extension: keep it in this file.
  dash: GridItem[] = [
    { id: 'sales', x: 0, y: 0, w: 6, h: 2 },
    { id: 'users', x: 6, y: 0, w: 6, h: 2 },
    { id: 'orders', x: 0, y: 2, w: 12, h: 2 },
  ];
}
