import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Skeleton } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<nd-skeleton shape="circle" width="44px" height="44px" />
<nd-skeleton width="60%" />`;

const API: ApiRow[] = [
  { name: "width", type: "string", default: "'100%'", description: "Any CSS width." },
  { name: "height", type: "string", default: "'14px'", description: "Any CSS height." },
  { name: "shape", type: "'text' | 'circle' | 'rect'", default: "'text'", description: "Corner style." },
  { name: "syncId", type: "string", default: "\u2014", description: "Lets the inspector write changes made in the browser into this template." },
];

@Component({
  selector: 'app-skeleton-page',
  imports: [Skeleton, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './skeleton-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonPage {
  readonly code = CODE;
  readonly api = API;
}
