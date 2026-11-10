import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Grid, GridItem } from 'ngx-nudge';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';

const CODE = `<nd-grid syncId="my-board" [layout]="board">
  <ng-template let-w>{{ w.id }}</ng-template>
</nd-grid>

// Drag or resize: the board array updates itself.`;

@Component({
  selector: 'app-grid-page',
  imports: [Grid, DocPage, CodeBlock],
  templateUrl: './grid-page.html',
  styleUrl: './grid-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridPage {
  readonly code = CODE;

  // Synced by the extension: keep it in this file.
  dash: GridItem[] = [
    { id: 'sales', x: 0, y: 0, w: 6, h: 2 },
    { id: 'users', x: 6, y: 0, w: 6, h: 2 },
    { id: 'orders', x: 0, y: 2, w: 12, h: 2 },
  ];
}
