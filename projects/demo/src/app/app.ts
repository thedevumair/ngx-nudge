import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Button, ThemePanel, Inspector } from 'ngx-nudge';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ThemePanel, Button, Inspector],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly theme = inject(ThemeService);

  readonly nav = [
    {
      group: 'Examples',
      links: [
        { path: '/orders', label: 'Orders' },
        { path: '/starter', label: 'Admin starter' },
      ],
    },
    {
      group: 'Components',
      links: [
        { path: '/docs/button', label: 'Button' },
        { path: '/docs/card', label: 'Card' },
        { path: '/docs/table', label: 'Table' },
        { path: '/docs/grid', label: 'Dashboard grid' },
        { path: '/docs/forms', label: 'Inputs & field' },
        { path: '/docs/dialog', label: 'Dialog' },
      ],
    },
  ];
}
