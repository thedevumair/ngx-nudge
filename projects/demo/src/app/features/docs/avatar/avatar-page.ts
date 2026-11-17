import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Avatar } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<nd-avatar name="Ayesha Khan" />
<nd-avatar name="Ayesha Khan" [src]="photoUrl" size="lg" />`;

const API: ApiRow[] = [
  { name: "name", type: "string", default: "required", description: "Used for initials, colour and the accessible label." },
  { name: "src", type: "string", default: "\u2014", description: "Photo URL. Falls back to initials if it fails to load." },
  { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Diameter." },
  { name: "syncId", type: "string", default: "\u2014", description: "Lets the inspector write changes made in the browser into this template." },
];

@Component({
  selector: 'app-avatar-page',
  imports: [Avatar, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './avatar-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarPage {
  readonly code = CODE;
  readonly api = API;
  readonly people = ['Ayesha Khan', 'Bilal Ahmed', 'Sana Malik', 'Usman Raza', 'Hira Siddiqui'];
}
