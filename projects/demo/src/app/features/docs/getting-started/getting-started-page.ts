import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';

const INSTALL = `npm i ngx-nudge`;

const ROOT = `// app.ts
import { Inspector, ThemePanel } from 'ngx-nudge';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemePanel, Inspector],
  template: \`
    <router-outlet />
    <nd-theme-panel />
    <nd-inspector />
  \`,
})
export class App {}`;

const FIRST = `import { Column, Table } from 'ngx-nudge';

@Component({
  selector: 'app-team',
  imports: [Table],
  template: \`<nd-table syncId="team" [data]="people" [columns]="teamColumns" />\`,
})
export class Team {
  people = [{ name: 'Ayesha', email: 'ayesha@acme.pk' }];

  teamColumns: Column[] = [
    { key: 'name', label: 'Name', width: 200 },
    { key: 'email', label: 'Email', width: 260 },
  ];
}`;

@Component({
  selector: 'app-getting-started-page',
  imports: [DocPage, CodeBlock],
  templateUrl: './getting-started-page.html',
  styleUrl: './getting-started-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GettingStartedPage {
  readonly install = INSTALL;
  readonly root = ROOT;
  readonly first = FIRST;
}
