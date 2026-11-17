import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Button } from 'ngx-nudge';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-docs-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Button],
  templateUrl: './docs-shell.html',
  styleUrl: './docs-shell.scss',
})
export class DocsShell {
  readonly theme = inject(ThemeService);

  readonly nav = [
    { group: 'Start', links: [{ path: '/docs/getting-started', label: 'Getting started' }] },
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
