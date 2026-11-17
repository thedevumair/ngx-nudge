# ngx-nudge

**Visual UI editing for Angular, written straight to your source code.**

Resize a table column, drag a dashboard widget, change a theme colour or a button's text in the browser, and the matching line in your own source file updates as an **unsaved edit** in VS Code. Review it, keep it, or press `Ctrl+Z`.

[![npm](https://img.shields.io/npm/v/ngx-nudge?color=748ffc)](https://www.npmjs.com/package/ngx-nudge)
[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/muhammadumair.ngx-nudge-sync?label=VS%20Code&color=748ffc)](https://marketplace.visualstudio.com/items?itemName=muhammadumair.ngx-nudge-sync)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**[Docs & live demo](https://ngx-nudge.netlify.app)** · **[npm](https://www.npmjs.com/package/ngx-nudge)** · **[VS Code extension](https://marketplace.visualstudio.com/items?itemName=muhammadumair.ngx-nudge-sync)**

> **Status:** early beta (0.1). It works, APIs may still change, and feedback is very welcome.

---

## Why

Every small UI change is a round trip: spot it in the browser, find the component, find the line, edit, save, wait for reload, check again.

ngx-nudge removes that round trip. You make the change where you see it, and it lands in your code.

| Change in the browser | Written to |
|---|---|
| Table column width, order, label, visibility | the bound `columns` array in your `.ts` |
| Dashboard widget position and size | the bound `layout` array in your `.ts` |
| Theme colours, radius, font size | `--nd-*` variables in your `styles.scss` |
| Inspector: a component's inputs and text | the attribute or text in your `.html` template |

- **Your code stays the source of truth.** No generated files, no extra config format.
- **Review before you save.** Edits are unsaved, so they show up like any other change.
- **Dev mode only.** Sync runs only under `ng serve`, never in production builds.

## Quick start

**1. Install the library**

```bash
npm install ngx-nudge
```

**2. Install the VS Code extension**

Search for **ngx-nudge Sync** in the Extensions panel, or [install it from the Marketplace](https://marketplace.visualstudio.com/items?itemName=muhammadumair.ngx-nudge-sync). The extension is what writes changes to your files. Without it, ngx-nudge still works as a normal UI kit.

**3. Use a component**

```ts
import { Column, Table } from 'ngx-nudge';

@Component({
  imports: [Table],
  template: `<nd-table syncId="users" [data]="users" [columns]="userColumns" />`,
})
export class UsersPage {
  users = [{ name: 'Ayesha', email: 'ayesha@acme.pk' }];

  userColumns: Column[] = [
    { key: 'name', label: 'Name', width: 200 },
    { key: 'email', label: 'Email', width: 260 },
  ];
}
```

**4. Add the dev tools once, in your root component**

```html
<nd-toaster />
<nd-theme-panel />
<nd-inspector />
```

Run `ng serve`, resize a column in the browser, and watch `userColumns` change in your editor.

## Components

| Group | Components |
|---|---|
| Actions | Button |
| Forms | Input, Select, Field, Checkbox, Radio, Switch, Autocomplete |
| Data display | Table, Dashboard grid, Card, Badge, Avatar |
| Navigation | Tabs, Menu, Breadcrumb, Pagination |
| Feedback | Alert, Toast, Dialog, Tooltip, Spinner, Progress, Skeleton |
| Dev tools | Theme panel, Inspector |

Form components work with `ngModel` and reactive forms. Every component is themed through `--nd-*` CSS variables.

## How it works

- `syncId` marks an element as editable. Without it, changes stay on screen only.
- In dev mode, the library sends each change to the extension on `127.0.0.1`.
- The extension finds the exact array, attribute or token in your file and applies an unsaved edit.
- It only rewrites plain data (`x = [...]`, `x = signal([...])`, `cfg = { cols: [...] }`, top-level `const` arrays). If something is unsafe to rewrite, it leaves the file alone and tells you why.

## Repository

```
projects/ngx-nudge   the Angular library (published to npm)
projects/demo        docs site and live demo
ui-kit-sync          the VS Code extension (ngx-nudge Sync)
```

Run it locally:

```bash
npm install
ng build ngx-nudge
ng serve demo
```

Extension tests: `cd ui-kit-sync && npm test`

## Feedback

This is an early beta, and real-world feedback shapes what comes next.

- Something broke or behaved strangely? [Open an issue](../../issues/new)
- An idea or a component you need? Open an issue and describe your use case.

## License

[MIT](LICENSE) © Muhammad Umair
