import { Injectable, computed, inject, signal } from '@angular/core';
import { Order } from '../models/order.model';
import { OrdersRepository } from '../repositories/orders.repository';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly repo = inject(OrdersRepository);

  readonly orders = signal<Order[]>(this.repo.list());

  /** Headline numbers keyed by widget id. */
  readonly kpis = computed<Record<string, string>>(() => {
    const all = this.orders();
    const active = all.filter((o) => o.status !== 'Cancelled');
    const revenue = active.reduce((sum, o) => sum + o.amount, 0);
    const refunds = all.length ? (all.length - active.length) / all.length : 0;
    return {
      Revenue: `Rs ${revenue.toLocaleString('en-US')}`,
      Orders: String(all.length),
      Refunds: `${(refunds * 100).toFixed(1)}%`,
    };
  });
}
