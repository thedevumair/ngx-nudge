import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Autocomplete, Field } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `<nd-autocomplete [options]="cities" [(value)]="city" placeholder="Search a city" />

<!-- or with forms -->
<nd-autocomplete [options]="cities" formControlName="city" />`;

const API: ApiRow[] = [
  { name: "options", type: "readonly string[]", default: "required", description: "The list to search." },
  { name: "value", type: "string | null (two-way)", default: "null", description: "The chosen option." },
  { name: "placeholder", type: "string", default: "''", description: "Hint text while empty." },
];

@Component({
  selector: 'app-autocomplete-page',
  imports: [Autocomplete, Field, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './autocomplete-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompletePage {
  readonly code = CODE;
  readonly api = API;
  readonly cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Hyderabad'];
  readonly city = signal<string | null>(null);
}
