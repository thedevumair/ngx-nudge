import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Inspector, ThemePanel, Toaster } from 'ngx-nudge';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemePanel, Inspector, Toaster],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
