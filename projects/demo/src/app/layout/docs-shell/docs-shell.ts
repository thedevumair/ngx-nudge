import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Button } from 'ngx-nudge';
import { ThemeService } from '../../core/services/theme.service';
import { DOCS_NAV } from './docs-nav';

@Component({
  selector: 'app-docs-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Button],
  templateUrl: './docs-shell.html',
  styleUrl: './docs-shell.scss',
})
export class DocsShell {
  readonly theme = inject(ThemeService);
  readonly nav = DOCS_NAV;
}
