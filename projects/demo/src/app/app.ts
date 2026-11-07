import { Component, signal } from '@angular/core';
import {
  Badge,
  BadgeVariant,
  Button,
  Card,
  Column,
  Dialog,
  Field,
  Grid,
  GridItem,
  Select,
  Table,
  TextInput,
  ThemePanel,
  syncTokens,
} from 'ui-kit';

const PRESETS: Record<string, Record<string, string>> = {
  Light: {
    '--ui-color-primary': '#3b5bdb',
    '--ui-color-primary-contrast': '#ffffff',
    '--ui-color-surface': '#ffffff',
    '--ui-color-text': '#222222',
    '--ui-color-border': '#dddddd',
  },
  Dark: {
    '--ui-color-primary': '#748ffc',
    '--ui-color-primary-contrast': '#111827',
    '--ui-color-surface': '#1b1e27',
    '--ui-color-text': '#e6e8ee',
    '--ui-color-border': '#343a4a',
  },
  Rose: {
    '--ui-color-primary': '#d6336c',
    '--ui-color-primary-contrast': '#ffffff',
    '--ui-color-surface': '#fff7fa',
    '--ui-color-text': '#3b1f2b',
    '--ui-color-border': '#f0c9d6',
  },
};

const SNIPPETS = {
  button: `<button ui-button>Save</button>
<button ui-button variant="outline" size="sm">Cancel</button>
<button ui-button variant="ghost" disabled>Disabled</button>`,
  card: `<ui-card>
  <h3 uiCardHeader>Title</h3>
  Body content
  <div uiCardFooter><button ui-button>OK</button></div>
</ui-card>`,
  table: `<ui-table syncId="orders" [data]="orders" [columns]="orderColumns" />

// Resize ya reorder karo: orderColumns array
// aapki file mein khud badal jata hai (unsaved).`,
  grid: `<ui-grid syncId="board" [layout]="board">
  <ng-template let-w>{{ w.id }}</ng-template>
</ui-grid>

// Drag ya resize karo: board array khud badalta hai.`,
  forms: `<input ui-input placeholder="Name" />
<select ui-select><option>Admin</option></select>
<ui-badge variant="success">Active</ui-badge>`,
  dialog: `<ui-dialog [(open)]="show">
  <h3 uiDialogTitle>Delete user?</h3>
  This cannot be undone.
  <div uiDialogActions>
    <button ui-button size="sm">Delete</button>
  </div>
</ui-dialog>`,
};

@Component({
  selector: 'app-root',
  imports: [Table, Grid, ThemePanel, Card, Button, Badge, TextInput, Select, Dialog, Field],
  template: `
    <div class="shell">
      <header class="top">
        <strong>UI Kit</strong>
        <span class="tag">Angular components that update your source</span>
        <div class="presets">
          @for (name of presetNames; track name) {
            <button ui-button variant="outline" size="sm" (click)="applyPreset(name)">
              {{ name }}
            </button>
          }
        </div>
      </header>

      <nav class="side">
        @for (p of pages; track p.id) {
          <button
            type="button"
            class="nav"
            [class.active]="page() === p.id"
            (click)="page.set(p.id)"
          >
            {{ p.label }}
          </button>
        }
      </nav>

      <main class="main">
        @switch (page()) {
          @case ('overview') {
            <h1>Components that write back</h1>
            <p class="lead">
              Resize a column, drag a widget, or change a colour on screen. The matching array or
              CSS variable in your source file updates itself as an unsaved edit. Review it, undo it
              or save it.
            </p>
            <div class="stack">
              <ui-card>
                <h3 uiCardHeader>Live source sync</h3>
                Layout and style changes are written into your own files, in dev mode only.
              </ui-card>
              <ui-card>
                <h3 uiCardHeader>One theme, every component</h3>
                Change one token and the whole kit follows. Try the presets at the top.
              </ui-card>
              <ui-card>
                <h3 uiCardHeader>Clean, small API</h3>
                Standalone components, signals, plain CSS variables. No modules, no theme files.
                <div uiCardFooter>
                  <button ui-button (click)="page.set('table')">See the table</button>
                </div>
              </ui-card>
            </div>
          }
          @case ('demo') {
            <h1>Orders</h1>
            <p class="lead">
              Drag a column edge to resize, or drag a header to reorder. Watch your code update.
            </p>
            <ui-table syncId="orders" [data]="orders" [columns]="orderColumns" />
            <h3>Overview</h3>
            <ui-grid syncId="board" [layout]="board" [rowHeight]="70">
              <ng-template let-w>
                <div class="kpi">
                  <span>{{ w.id }}</span>
                  <strong>{{ kpi[w.id] }}</strong>
                </div>
              </ng-template>
            </ui-grid>
          }
          @case ('button') {
            <h1>Button</h1>
            <p class="lead">Three variants and three sizes, driven by theme tokens.</p>
            <ui-card>
              <h3 uiCardHeader>Preview</h3>
              <div class="row">
                <button ui-button>Save</button>
                <button ui-button variant="outline" size="sm">Cancel</button>
                <button ui-button variant="ghost" disabled>Disabled</button>
              </div>
            </ui-card>
            <pre class="code">{{ snippets.button }}</pre>
          }
          @case ('card') {
            <h1>Card</h1>
            <p class="lead">A surface with optional header and footer slots.</p>
            <ui-card>
              <h3 uiCardHeader>Preview</h3>
              Body content goes here.
              <div uiCardFooter><button ui-button size="sm">OK</button></div>
            </ui-card>
            <pre class="code">{{ snippets.card }}</pre>
          }
          @case ('table') {
            <h1>Table</h1>
            <p class="lead">
              Sort, paginate, resize and reorder. Resize a column, then look at
              <code>app.ts</code>.
            </p>
            <h3>Users</h3>
            <ui-table syncId="users" [data]="users" [columns]="columns" />
            <h3>Admins</h3>
            <ui-table syncId="admins" [data]="admins" [columns]="adminColumns" />
            <pre class="code">{{ snippets.table }}</pre>
          }
          @case ('grid') {
            <h1>Dashboard grid</h1>
            <p class="lead">Drag widgets by the bar, resize from the corner.</p>
            <ui-grid syncId="dash" [layout]="dash">
              <ng-template let-w
                ><strong>{{ w.id }}</strong> widget</ng-template
              >
            </ui-grid>
            <pre class="code">{{ snippets.grid }}</pre>
          }
          @case ('forms') {
            <h1>Inputs & badge</h1>
            <p class="lead">
              Native elements with kit styling, so keyboard and forms work out of the box.
            </p>
            <ui-card>
              <h3 uiCardHeader>Preview</h3>
              <div class="form">
                <label>Name <input ui-input placeholder="Your name" /></label>
                <label>
                  Role
                  <select ui-select>
                    <option>Admin</option>
                    <option>User</option>
                  </select>
                </label>
                <label>Invalid <input ui-input aria-invalid="true" value="oops" /></label>
                <div class="row">
                  <ui-badge>Neutral</ui-badge>
                  <ui-badge variant="primary">Primary</ui-badge>
                  <ui-badge variant="success">Success</ui-badge>
                  <ui-badge variant="warning">Warning</ui-badge>
                  <ui-badge variant="danger">Danger</ui-badge>
                </div>
              </div>
            </ui-card>
            <pre class="code">{{ snippets.forms }}</pre>
          }
          @case ('dialog') {
            <h1>Dialog</h1>
            <p class="lead">
              Built on the native dialog element: Esc, focus trap and backdrop click included.
            </p>
            <button ui-button (click)="showDialog.set(true)">Open dialog</button>
            <ui-dialog [(open)]="showDialog">
              <h3 uiDialogTitle>Delete user?</h3>
              This cannot be undone.
              <div uiDialogActions>
                <button ui-button variant="outline" size="sm" (click)="showDialog.set(false)">
                  Cancel
                </button>
                <button ui-button size="sm" (click)="showDialog.set(false)">Delete</button>
              </div>
            </ui-dialog>
            <pre class="code">{{ snippets.dialog }}</pre>
          }
          @case ('starter') {
            <h1>Admin starter</h1>
            <p class="lead">
              A small admin screen built only from kit components. Resize a column or switch a
              preset.
            </p>
            <div class="stats">
              @for (s of stats; track s.label) {
                <ui-card>
                  <div class="stat">
                    <span>{{ s.label }}</span>
                    <strong>{{ s.value }}</strong>
                    <ui-badge [variant]="s.variant">{{ s.delta }}</ui-badge>
                  </div>
                </ui-card>
              }
            </div>
            <div class="starter-head">
              <h3>Team</h3>
              <button ui-button size="sm" (click)="invite.set(true)">Invite user</button>
            </div>
            <ui-table syncId="team" [data]="users" [columns]="teamColumns" />

            <ui-dialog [(open)]="invite">
              <h3 uiDialogTitle>Invite user</h3>
              <div class="form">
                <ui-field label="Email" hint="We will send an invite link." [required]="true">
                  <input ui-input type="email" placeholder="name@company.com" />
                </ui-field>
                <ui-field label="Role">
                  <select ui-select>
                    <option>Admin</option>
                    <option>User</option>
                  </select>
                </ui-field>
              </div>
              <div uiDialogActions>
                <button ui-button variant="outline" size="sm" (click)="invite.set(false)">
                  Cancel
                </button>
                <button ui-button size="sm" (click)="invite.set(false)">Send invite</button>
              </div>
            </ui-dialog>
          }
        }
      </main>
    </div>
    <ui-theme-panel />
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        color: var(--ui-color-text, #222222);
        background: var(--ui-color-surface, #ffffff);
        font-family: system-ui, sans-serif;
      }
      .kpi {
        display: grid;
        gap: 4px;
      }
      .kpi span {
        font-size: 12px;
        opacity: 0.6;
      }
      .kpi strong {
        font-size: 22px;
      }
      .shell {
        display: grid;
        grid-template-columns: 220px 1fr;
        grid-template-rows: auto 1fr;
        min-height: 100vh;
      }
      .top {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 12px 24px;
        border-bottom: 1px solid var(--ui-color-border, #dddddd);
      }
      .tag {
        font-size: 13px;
        opacity: 0.65;
      }
      .presets {
        display: flex;
        gap: 8px;
        margin-left: auto;
      }
      .side {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 16px;
        border-right: 1px solid var(--ui-color-border, #dddddd);
      }
      .nav {
        padding: 8px 12px;
        text-align: left;
        font: inherit;
        color: inherit;
        background: transparent;
        border: 0;
        border-radius: var(--ui-radius, 6px);
        cursor: pointer;
      }
      .nav:hover {
        background: color-mix(in srgb, var(--ui-color-text, #222222) 8%, transparent);
      }
      .nav.active {
        color: var(--ui-color-primary-contrast, #ffffff);
        background: var(--ui-color-primary, #3b5bdb);
      }
      .main {
        max-width: 1000px;
        padding: 24px 32px 120px;
      }
      .lead {
        max-width: 640px;
        opacity: 0.75;
        line-height: 1.5;
      }
      .stack {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .row {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .code {
        margin-top: 16px;
        padding: 12px 16px;
        overflow: auto;
        font-size: 12px;
        line-height: 1.5;
        border: 1px solid var(--ui-color-border, #dddddd);
        border-radius: var(--ui-radius, 6px);
        background: color-mix(
          in srgb,
          var(--ui-color-text, #222222) 5%,
          var(--ui-color-surface, #ffffff)
        );
      }
      .form {
        display: grid;
        gap: 12px;
        max-width: 360px;
      }
      .form label {
        display: grid;
        gap: 4px;
        font-size: 13px;
      }
      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }
      .stat {
        display: grid;
        gap: 4px;
      }
      .stat strong {
        font-size: 24px;
      }
      .starter-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 24px 0 8px;
      }
    `,
  ],
})
export class App {
  snippets = SNIPPETS;
  presetNames = Object.keys(PRESETS);
  pages = [
    { id: 'demo', label: 'Orders demo' },
    { id: 'overview', label: 'Overview' },
    { id: 'button', label: 'Button' },
    { id: 'card', label: 'Card' },
    { id: 'table', label: 'Table' },
    { id: 'grid', label: 'Dashboard grid' },
    { id: 'forms', label: 'Inputs & badge' },
    { id: 'dialog', label: 'Dialog' },
    { id: 'starter', label: 'Admin starter' },
  ];
  page = signal('demo');
  showDialog = signal(false);
  invite = signal(false);
  kpi: Record<string, string> = {
    Revenue: 'Rs 1.24M',
    Orders: '1,284',
    Refunds: '1.8%',
  };

  orders = [
    {
      order: '#10482',
      customer: 'Ayesha Khan',
      status: 'Delivered',
      amount: 'Rs 12,400',
      date: '04 Nov 2026',
    },
    {
      order: '#10481',
      customer: 'Bilal Ahmed',
      status: 'Shipped',
      amount: 'Rs 8,250',
      date: '04 Nov 2026',
    },
    {
      order: '#10480',
      customer: 'Sana Malik',
      status: 'Processing',
      amount: 'Rs 21,990',
      date: '03 Nov 2026',
    },
    {
      order: '#10479',
      customer: 'Hamza Sheikh',
      status: 'Delivered',
      amount: 'Rs 3,600',
      date: '03 Nov 2026',
    },
    {
      order: '#10478',
      customer: 'Fatima Noor',
      status: 'Cancelled',
      amount: 'Rs 5,150',
      date: '02 Nov 2026',
    },
    {
      order: '#10477',
      customer: 'Usman Raza',
      status: 'Delivered',
      amount: 'Rs 14,800',
      date: '02 Nov 2026',
    },
  ];

  orderColumns: Column[] = [
    { key: 'order', label: 'Order', width: 110 },
    { key: 'status', label: 'Status', width: 247 },
    { key: 'customer', label: 'Customer', width: 220 },
    { key: 'amount', label: 'Amount', width: 140 },
    { key: 'date', label: 'Date', width: 353 },
  ];

  board: GridItem[] = [
    { id: 'Revenue', x: 0, y: 0, w: 5, h: 2 },
    { id: 'Orders', x: 6, y: 0, w: 3, h: 2 },
    { id: 'Refunds', x: 9, y: 0, w: 3, h: 2 },
  ];
  stats: { label: string; value: string; delta: string; variant: BadgeVariant }[] = [
    { label: 'Revenue', value: 'Rs 1.2M', delta: '+12%', variant: 'success' },
    { label: 'Active users', value: '3,482', delta: '+4%', variant: 'primary' },
    { label: 'Open tickets', value: '27', delta: '-8%', variant: 'warning' },
  ];

  teamColumns: Column[] = [
    { key: 'name', width: 200 },
    { key: 'email', width: 300 },
    { key: 'role', width: 150 },
  ];

  applyPreset(name: string) {
    const tokens = PRESETS[name];
    for (const [key, value] of Object.entries(tokens)) {
      document.documentElement.style.setProperty(key, value); // foran screen par
    }
    syncTokens(tokens); // aur styles.scss mein (unsaved)
    window.dispatchEvent(new Event('ui-theme-change')); // panel ke sliders refresh
  }

  users = [
    { name: 'Ali', email: 'ali@x.com', role: 'Admin' },
    { name: 'Sara', email: 'sara@x.com', role: 'User' },
    { name: 'Hamza', email: 'hamza@x.com', role: 'User' },
  ];

  admins = [
    { id: 1, username: 'root', lastLogin: '2026-10-30', level: 5 },
    { id: 2, username: 'umair', lastLogin: '2026-10-29', level: 3 },
  ];

  columns: Column[] = [
    { key: 'name', width: 200 },
    { key: 'email', width: 300 },
    { key: 'role', width: 150 },
  ];

  adminColumns: Column[] = [
    { key: 'id', width: 80 },
    { key: 'username', width: 200 },
    { key: 'lastLogin', width: 200 },
    { key: 'level', width: 100 },
  ];

  dash: GridItem[] = [
    { id: 'sales', x: 0, y: 0, w: 6, h: 2 },
    { id: 'users', x: 6, y: 0, w: 6, h: 2 },
    { id: 'orders', x: 0, y: 2, w: 12, h: 2 },
  ];
}
