import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { InMemoryOrdersRepository, OrdersRepository } from './core/repositories/orders.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: OrdersRepository, useClass: InMemoryOrdersRepository },
  ],
};
