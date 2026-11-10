import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemePanel } from 'ngx-nudge';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ThemePanel],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly links = [
    { path: '/orders', label: 'Orders' },
    { path: '/showcase', label: 'Showcase' },
  ];
}
