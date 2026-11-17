# ngx-nudge

Angular components that write your changes back into your code.

Resize a table column, drag a dashboard widget, change a colour or a button variant in the browser, and the matching line in your own source file updates itself as an **unsaved edit** in VS Code. Undo works. You decide when to save. No prompts, no AI.

> Early beta (0.x). APIs may change.

## Install

```bash
npm install ngx-nudge
```

Then install the **ngx-nudge Sync** extension in VS Code, or in Cursor through Open VSX. The extension is what writes changes to your files. Without it, the components still work as a normal UI kit.

## Quick start

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

Add the dev tools once, in your root component. They render nothing in production builds:

```html
<nd-toaster />
<nd-theme-panel />
<nd-inspector />
```

Run `ng serve`, resize a column in the browser, and watch `userColumns` change in your editor.

## How it works

- `syncId` marks an element as editable. Without it, changes stay on screen only.
- Changes go to the extension on `127.0.0.1` in **dev mode only** (`isDevMode()`). Production builds never send anything.
- The extension edits the open document as an unsaved change, so `Ctrl+Z` reverts it.

## Components

| Group | Components |
|---|---|
| Actions | Button |
| Forms | Input, Select, Field, Checkbox, Radio, Switch, Autocomplete |
| Data display | Table, Dashboard grid, Card, Badge, Avatar |
| Navigation | Tabs, Menu, Breadcrumb, Pagination |
| Feedback | Alert, Toast, Dialog, Tooltip, Spinner, Progress, Skeleton |
| Dev tools | Theme panel, Inspector |

Native-element components (`input[nd-input]`, `select[nd-select]`, `input[nd-checkbox]`, `input[nd-radio]`, `input[nd-switch]`) and Autocomplete work with `ngModel` and reactive forms.

## What syncs to your code

| Change in the browser | Written to |
|---|---|
| Table column width, order, label, visibility | the bound `columns` array |
| Grid widget position and size | the bound `layout` array |
| Theme panel colours and sizes | `--nd-*` variables in `styles.scss` |
| Inspector: inputs and text of a component with a `syncId` | the attribute or text in its template |

The extension rewrites plain data only: `x = [...]`, `x = signal([...])`, `cfg = { cols: [...] }` and top-level `const` arrays. Arrays that contain function calls, references or translations are left untouched, and the extension tells you why.

## Theming

Every component reads `--nd-*` CSS variables, for example `--nd-color-primary`, `--nd-radius` and `--nd-font-size`. The full list is exported as `TOKENS`.

## License

MIT
