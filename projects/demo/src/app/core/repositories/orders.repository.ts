import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';

/** Data-access contract. Swap the implementation (for example HTTP) without touching pages. */
export abstract class OrdersRepository {
  abstract list(): Order[];
}

@Injectable()
export class InMemoryOrdersRepository extends OrdersRepository {
  private readonly rows: Order[] = [
    {
      id: '#10482',
      customer: 'Ayesha Khan',
      status: 'Delivered',
      amount: 12400,
      date: '04 Nov 2026',
    },
    { id: '#10481', customer: 'Bilal Ahmed', status: 'Shipped', amount: 8250, date: '04 Nov 2026' },
    {
      id: '#10480',
      customer: 'Sana Malik',
      status: 'Processing',
      amount: 21990,
      date: '03 Nov 2026',
    },
    {
      id: '#10479',
      customer: 'Hamza Sheikh',
      status: 'Delivered',
      amount: 3600,
      date: '03 Nov 2026',
    },
    {
      id: '#10478',
      customer: 'Fatima Noor',
      status: 'Cancelled',
      amount: 5150,
      date: '02 Nov 2026',
    },
    {
      id: '#10477',
      customer: 'Usman Raza',
      status: 'Delivered',
      amount: 14800,
      date: '02 Nov 2026',
    },
  ];

  list(): Order[] {
    return [...this.rows];
  }
}
