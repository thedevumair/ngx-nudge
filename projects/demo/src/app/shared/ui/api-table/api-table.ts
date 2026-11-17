import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface ApiRow {
  name: string;
  type: string;
  default: string;
  description: string;
}

/** The inputs, outputs and slots of a component, as a table. */
@Component({
  selector: 'app-api-table',
  template: `
    <h2>{{ heading() }}</h2>
    <div class="wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          @for (r of rows(); track r.name) {
            <tr>
              <td><code>{{ r.name }}</code></td>
              <td><code class="type">{{ r.type }}</code></td>
              <td>{{ r.default }}</td>
              <td>{{ r.description }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styleUrl: './api-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiTable {
  rows = input.required<ApiRow[]>();
  heading = input('API');
}
