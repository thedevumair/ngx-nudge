import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Card } from 'ngx-nudge';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';

const CODE = `<button nd-button>Save</button>
<button nd-button variant="outline" size="sm">Cancel</button>
<button nd-button variant="ghost" disabled>Disabled</button>`;

@Component({
  selector: 'app-button-page',
  imports: [Button, Card, DocPage, CodeBlock],
  templateUrl: './button-page.html',
  styleUrl: './button-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonPage {
  readonly code = CODE;
}
