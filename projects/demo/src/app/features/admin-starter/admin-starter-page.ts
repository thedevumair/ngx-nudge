import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Button, Card, Column, Dialog, Field, Select, Table, TextInput } from 'ngx-nudge';
import { OrdersService } from '../../core/services/orders.service';
import { UsersService } from '../../core/services/users.service';
import { DocPage } from '../../shared/ui/doc-page/doc-page';

@Component({
  selector: 'app-admin-starter-page',
  imports: [Button, Card, Dialog, Field, Select, Table, TextInput, DocPage],
  templateUrl: './admin-starter-page.html',
  styleUrl: './admin-starter-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminStarterPage {
  readonly users = inject(UsersService).users;
  private readonly kpis = inject(OrdersService).kpis;
  readonly stats = computed(() => Object.entries(this.kpis()));
  readonly invite = signal(false);

  // Synced by the extension: keep it in this file.
  teamColumns: Column[] = [
    { key: 'name', label: 'Name', width: 200 },
    { key: 'email', label: 'Email', width: 260 },
    { key: 'role', label: 'Role', width: 120 },
  ];
}
