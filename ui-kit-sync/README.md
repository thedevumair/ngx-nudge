# ngx-nudge Sync

Companion extension for the [ngx-nudge](https://www.npmjs.com/package/ngx-nudge) Angular UI kit.

Change something in your running app, and this extension writes it into your source:

- resize or reorder a table column → the `columns` array updates
- drag or resize a dashboard widget → the `layout` array updates
- change a theme colour → the `--nd-*` variable in `styles.scss` updates
- edit a component in the inspector → the attribute or text in your template updates

Every change is an **unsaved edit**: review it, undo it with Ctrl+Z, or save it.

## Status bar

- `ON (4567)`: listening.
- `OFF - trust this folder to enable`: the workspace is in Restricted Mode.
- `no free port`: more than five VS Code windows are running it.

## Privacy

The extension listens on `127.0.0.1` only, for requests from your own dev server. Nothing leaves your machine.

## License

MIT
