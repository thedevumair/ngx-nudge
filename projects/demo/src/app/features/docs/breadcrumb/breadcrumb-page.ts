import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Breadcrumb, Crumb } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<nd-breadcrumb>
  <a nd-crumb routerLink="/">Home</a>
  <a nd-crumb routerLink="/projects">Projects</a>
  <span nd-crumb [current]="true">Settings</span>
</nd-breadcrumb>`;

const API: ApiRow[] = [
  { name: "nd-crumb current", type: "boolean", default: "false", description: "Marks the current page." },
];

@Component({
  selector: 'app-breadcrumb-page',
  imports: [Breadcrumb, Crumb, RouterLink, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './breadcrumb-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbPage {
  readonly code = CODE;
  readonly api = API;
}
