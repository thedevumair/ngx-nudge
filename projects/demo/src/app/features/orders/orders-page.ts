import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Column, Grid, GridItem, Table } from 'ngx-nudge';
import { OrdersService } from '../../core/services/orders.service';

@Component({
  selector: 'app-orders-page',
  imports: [Table, Grid],
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPage {
  private readonly ordersService = inject(OrdersService);

  readonly orders = this.ordersService.orders;
  readonly kpis = this.ordersService.kpis;

  // Layout config stays in this file on purpose: the sync extension edits these arrays.
  orderColumns: Column[] = [
    { key: 'id', label: 'Order', width: 110 },
    { key: 'customer', label: 'Customer', width: 220 },
    { key: 'status', label: 'Status', width: 140 },
    { key: 'amount', label: 'Amount', width: 140 },
    { key: 'date', label: 'Date', width: 160 },
  ];

  board: GridItem[] = [
    { id: 'Revenue', x: 0, y: 0, w: 6, h: 2 },
    { id: 'Orders', x: 6, y: 0, w: 3, h: 2 },
    { id: 'Refunds', x: 9, y: 0, w: 3, h: 2 },
  ];
}
