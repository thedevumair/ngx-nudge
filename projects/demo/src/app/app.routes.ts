import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'ngx-nudge · Angular components that write back to your code',
    loadComponent: () => import('./features/landing/landing-page').then((m) => m.LandingPage),
  },
  {
    path: '',
    loadComponent: () => import('./layout/docs-shell/docs-shell').then((m) => m.DocsShell),
    children: [
      { path: 'orders', title: 'Orders', loadComponent: () => import('./features/orders/orders-page').then((m) => m.OrdersPage) },
      { path: 'starter', title: 'Admin starter', loadComponent: () => import('./features/admin-starter/admin-starter-page').then((m) => m.AdminStarterPage) },
      { path: 'docs', loadChildren: () => import('./features/docs/docs.routes').then((m) => m.DOCS_ROUTES) },
    ],
  },
  { path: '**', redirectTo: '' },
];
