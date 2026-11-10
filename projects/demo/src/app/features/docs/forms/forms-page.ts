import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, Field, Select, TextInput } from 'ngx-nudge';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';

const CODE = `<nd-field label="Email" hint="We will send a link" [required]="true">
  <input nd-input type="email" />
</nd-field>
<select nd-select><option>Admin</option></select>
<nd-badge variant="success">Active</nd-badge>`;

@Component({
  selector: 'app-forms-page',
  imports: [Badge, Card, Field, Select, TextInput, DocPage, CodeBlock],
  templateUrl: './forms-page.html',
  styleUrl: './forms-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsPage {
  readonly code = CODE;
}
