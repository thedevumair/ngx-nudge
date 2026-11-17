import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Inspector, ThemePanel } from 'ngx-nudge';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemePanel, Inspector],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
