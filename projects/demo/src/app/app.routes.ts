import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'orders' },
  {
    path: 'orders',
    title: 'Orders',
    loadComponent: () => import('./features/orders/orders-page').then((m) => m.OrdersPage),
  },
  {
    path: 'showcase',
    title: 'Showcase',
    loadComponent: () => import('./features/showcase/showcase-page').then((m) => m.ShowcasePage),
  },
];
