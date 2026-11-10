export type OrderStatus = 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled';

export interface Order {
  id: string;
  customer: string;
  status: OrderStatus;
  amount: number;
  date: string;
}
