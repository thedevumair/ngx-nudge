import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'orders' },
  {
    path: 'orders',
    title: 'Orders',
    loadComponent: () => import('./features/orders/orders-page').then((m) => m.OrdersPage),
  },
  {
    path: 'starter',
    title: 'Admin starter',
    loadComponent: () =>
      import('./features/admin-starter/admin-starter-page').then((m) => m.AdminStarterPage),
  },
  {
    path: 'docs',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'button' },
      {
        path: 'button',
        title: 'Button',
        loadComponent: () => import('./features/docs/button/button-page').then((m) => m.ButtonPage),
      },
      {
        path: 'card',
        title: 'Card',
        loadComponent: () => import('./features/docs/card/card-page').then((m) => m.CardPage),
      },
      {
        path: 'table',
        title: 'Table',
        loadComponent: () => import('./features/docs/table/table-page').then((m) => m.TablePage),
      },
      {
        path: 'grid',
        title: 'Grid',
        loadComponent: () => import('./features/docs/grid/grid-page').then((m) => m.GridPage),
      },
      {
        path: 'forms',
        title: 'Forms',
        loadComponent: () => import('./features/docs/forms/forms-page').then((m) => m.FormsPage),
      },
      {
        path: 'dialog',
        title: 'Dialog',
        loadComponent: () => import('./features/docs/dialog/dialog-page').then((m) => m.DialogPage),
      },
    ],
  },
  { path: '**', redirectTo: 'orders' },
];
