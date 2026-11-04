import { Component, signal } from '@angular/core';
import { Table, Column, Grid, GridItem, ThemePanel } from 'ui-kit';
@Component({
  selector: 'app-root',
  imports: [Table, Grid, ThemePanel],
  template: `
    <ui-table syncId="users" [data]="users" [columns]="columns" />
    <ui-table syncId="admins" [data]="admins" [columns]="adminColumns" />
    <h3>Dashboard</h3>
    <ui-grid syncId="dash" [layout]="dash">
      <ng-template let-w
        ><strong>{{ w.id }}</strong> widget</ng-template
      >
    </ui-grid>
    <ui-theme-panel />
  `,
})
export class App {
  users = [
    { name: 'Ali', email: 'ali@x.com', role: 'Admin' },
    { name: 'Sara', email: 'sara@x.com', role: 'User' },
    { name: 'Hamza', email: 'hamza@x.com', role: 'User' },
  ];

  admins = [
    { id: 1, username: 'root', lastLogin: '2026-10-30', level: 5 },
    { id: 2, username: 'umair', lastLogin: '2026-10-29', level: 3 },
  ];

  columns: Column[] = [
    { key: 'name', width: 200 },
    { key: 'email', width: 300 },
    { key: 'role', width: 150 },
  ];

  adminColumns: Column[] = [
    { key: 'id', width: 80 },
    { key: 'username', width: 200 },
    { key: 'lastLogin', width: 200 },
    { key: 'level', width: 100 },
  ];

  dash: GridItem[] = [
    { id: 'sales', x: 0, y: 0, w: 6, h: 2 },
    { id: 'users', x: 6, y: 0, w: 6, h: 2 },
    { id: 'orders', x: 0, y: 2, w: 12, h: 2 },
  ];

  output = signal('');
}
