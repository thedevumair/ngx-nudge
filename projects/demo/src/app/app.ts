import { Component, signal } from '@angular/core';
import { Table, Column } from 'ui-kit';

@Component({
  selector: 'app-root',
  imports: [Table],
  template: `
    <ui-table
      syncId="users"
      [data]="users"
      [columns]="columns"
      (columnsChange)="onLayout($event)"
    />
    <h4>Naya config (yahi code mein jana chahiye):</h4>
    <pre>{{ output() }}</pre>
  `,
})
export class App {
  users = [
    { name: 'Ali', email: 'ali@x.com', role: 'Admin' },
    { name: 'Sara', email: 'sara@x.com', role: 'User' },
    { name: 'Hamza', email: 'hamza@x.com', role: 'User' },
  ];

  // @ui-table users
  columns: Column[] = [
    { key: 'name', width: 200 },
    { key: 'email', width: 300 },
    { key: 'role', width: 150 },
  ];

  output = signal('');

  onLayout(cols: Column[]) {
    console.log(cols);
    this.output.set(JSON.stringify(cols, null, 2));
  }
}
