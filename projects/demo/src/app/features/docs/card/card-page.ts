import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Card } from 'ngx-nudge';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';

const CODE = `<nd-card>
  <h3 ndCardHeader>Title</h3>
  Body content
  <div ndCardFooter><button nd-button>OK</button></div>
</nd-card>`;

@Component({
  selector: 'app-card-page',
  imports: [Button, Card, DocPage, CodeBlock],
  templateUrl: './card-page.html',
  styleUrl: './card-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPage {
  readonly code = CODE;
}
