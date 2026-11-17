import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button, Column, Grid, GridItem, Table, TableDensity } from 'ngx-nudge';
import { CodeWindow } from '../../shared/ui/code-window/code-window';
import { LiveCode } from '../../shared/ui/code-window/live-code';
import { GITHUB_URL, INSTALL_CMD } from '../../site.config';
import { boardLines, scssLines, tableHtmlLines, tsColumnLines } from './code-gen';
import {
  FEATURES,
  INITIAL_BOARD,
  INITIAL_COLUMNS,
  KPIS,
  NUDGE_WAY,
  STEPS,
  TEAM,
  THEMES,
  ThemeName,
  USUAL_WAY,
} from './landing.data';

const clone = <T>(v: T): T => structuredClone(v);

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink, Button, Table, Grid, CodeWindow],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage {
  readonly github = GITHUB_URL;
  readonly install = INSTALL_CMD;
  readonly team = TEAM;
  readonly kpis = KPIS;
  readonly themes = THEMES;
  readonly themeNames = Object.keys(THEMES) as ThemeName[];
  readonly densities: TableDensity[] = ['compact', 'normal', 'comfortable'];
  readonly usualWay = USUAL_WAY;
  readonly nudgeWay = NUDGE_WAY;
  readonly steps = STEPS;
  readonly features = FEATURES;
  readonly year = new Date().getFullYear();

  // Playground state. The *Input signals feed the components; the others mirror what they emit.
  readonly tableInput = signal<Column[]>(clone(INITIAL_COLUMNS));
  readonly columns = signal<Column[]>(clone(INITIAL_COLUMNS));
  readonly density = signal<TableDensity>('normal');
  readonly striped = signal(true);
  readonly theme = signal<ThemeName>('Indigo');
  readonly boardInput = signal<GridItem[]>(clone(INITIAL_BOARD));
  readonly board = signal<GridItem[]>(clone(INITIAL_BOARD));

  readonly themeStyle = computed(() => THEMES[this.theme()]);

  readonly tsFile = new LiveCode('team.component.ts', () => tsColumnLines(this.columns()));
  readonly htmlFile = new LiveCode('team.component.html', () =>
    tableHtmlLines(this.density(), this.striped()),
  );
  readonly scssFile = new LiveCode('styles.scss', () => scssLines(THEMES[this.theme()]));
  readonly tableFiles = [this.tsFile, this.htmlFile, this.scssFile];
  readonly tableTab = signal(this.tsFile.name);

  readonly boardFile = new LiveCode('dashboard.component.ts', () => boardLines(this.board()));
  readonly boardFiles = [this.boardFile];
  readonly boardTab = signal(this.boardFile.name);

  readonly copied = signal(false);

  onColumns(cols: Column[]): void {
    this.tsFile.change(() => this.columns.set(cols));
    this.tableTab.set(this.tsFile.name);
  }

  setDensity(d: TableDensity): void {
    if (d === this.density()) return;
    this.htmlFile.change(() => this.density.set(d));
    this.tableTab.set(this.htmlFile.name);
  }

  setStriped(on: boolean): void {
    this.htmlFile.change(() => this.striped.set(on));
    this.tableTab.set(this.htmlFile.name);
  }

  setTheme(t: ThemeName): void {
    if (t === this.theme()) return;
    this.scssFile.change(() => this.theme.set(t));
    this.tableTab.set(this.scssFile.name);
  }

  onBoard(items: GridItem[]): void {
    this.boardFile.change(() => this.board.set(items));
  }

  reset(): void {
    this.tableInput.set(clone(INITIAL_COLUMNS));
    this.columns.set(clone(INITIAL_COLUMNS));
    this.density.set('normal');
    this.striped.set(true);
    this.theme.set('Indigo');
    this.boardInput.set(clone(INITIAL_BOARD));
    this.board.set(clone(INITIAL_BOARD));
    for (const f of [...this.tableFiles, this.boardFile]) f.reset();
    this.tableTab.set(this.tsFile.name);
  }

  copy(): void {
    navigator.clipboard?.writeText(this.install).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }
}
