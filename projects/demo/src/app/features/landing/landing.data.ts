import { Column, GridItem } from 'ngx-nudge';

export const TEAM = [
  { name: 'Ayesha Khan', email: 'ayesha@acme.pk', role: 'Admin', status: 'Active' },
  { name: 'Bilal Ahmed', email: 'bilal@acme.pk', role: 'Editor', status: 'Active' },
  { name: 'Sana Malik', email: 'sana@acme.pk', role: 'Viewer', status: 'Invited' },
  { name: 'Usman Raza', email: 'usman@acme.pk', role: 'Editor', status: 'Active' },
  { name: 'Hira Siddiqui', email: 'hira@acme.pk', role: 'Admin', status: 'Away' },
];

export const INITIAL_COLUMNS: Column[] = [
  { key: 'name', label: 'Name', width: 160 },
  { key: 'email', label: 'Email', width: 200 },
  { key: 'role', label: 'Role', width: 100 },
  { key: 'status', label: 'Status', width: 110 },
];

export const INITIAL_BOARD: GridItem[] = [
  { id: 'Revenue', x: 0, y: 0, w: 6, h: 2 },
  { id: 'Orders', x: 6, y: 0, w: 3, h: 2 },
  { id: 'Users', x: 9, y: 0, w: 3, h: 2 },
  { id: 'Refunds', x: 0, y: 2, w: 12, h: 1 },
];

export const KPIS: Record<string, string> = {
  Revenue: 'Rs 1.24M',
  Orders: '1,284',
  Users: '3,482',
  Refunds: '1.8%',
};

export type ThemeName = 'Indigo' | 'Rose' | 'Emerald' | 'Midnight';

export const THEMES: Record<ThemeName, Record<string, string>> = {
  Indigo: {
    '--nd-color-primary': '#4f46e5',
    '--nd-color-primary-contrast': '#ffffff',
    '--nd-color-surface': '#ffffff',
    '--nd-color-text': '#1f2937',
    '--nd-color-border': '#e5e7eb',
    '--nd-radius': '10px',
  },
  Rose: {
    '--nd-color-primary': '#e11d48',
    '--nd-color-primary-contrast': '#ffffff',
    '--nd-color-surface': '#fff7f9',
    '--nd-color-text': '#3b1f2b',
    '--nd-color-border': '#f5d0db',
    '--nd-radius': '14px',
  },
  Emerald: {
    '--nd-color-primary': '#059669',
    '--nd-color-primary-contrast': '#ffffff',
    '--nd-color-surface': '#f6fffb',
    '--nd-color-text': '#12332a',
    '--nd-color-border': '#cdeee0',
    '--nd-radius': '6px',
  },
  Midnight: {
    '--nd-color-primary': '#818cf8',
    '--nd-color-primary-contrast': '#0b1020',
    '--nd-color-surface': '#141826',
    '--nd-color-text': '#e6e8ee',
    '--nd-color-border': '#2a3146',
    '--nd-radius': '12px',
  },
};

export const USUAL_WAY = [
  'Open the component file',
  'Find the columns array',
  'Guess a width. 217? 231?',
  'Save and wait for the reload',
  'Compare it in the browser',
  'Repeat until it looks right',
];

export const NUDGE_WAY = [
  'Drag the edge until it looks right',
  'The code is already updated',
  'Save when you are happy',
];

export const STEPS = [
  {
    title: 'Install',
    body: 'Add the package, then the ngx-nudge Sync extension for VS Code or Cursor.',
    code: 'npm i ngx-nudge',
  },
  {
    title: 'Mark it',
    body: 'Give a component a syncId so the extension knows which code it belongs to.',
    code: '<nd-table syncId="team" ... />',
  },
  {
    title: 'Change it',
    body: 'Drag, recolour or inspect it in the browser. Your file updates, unsaved.',
    code: 'Ctrl+S when you like it',
  },
];

export const FEATURES = [
  {
    title: 'Unsaved, undoable edits',
    body: 'Every change lands in your editor as an unsaved edit. Ctrl+Z works. You decide when to save.',
  },
  {
    title: 'No AI, no guessing',
    body: 'Edits come from the TypeScript syntax tree. The same drag gives the same code, every time.',
  },
  {
    title: 'Fits your code',
    body: 'Plain arrays, signals, nested configs and shared constants. Anything unsafe is left alone, with a reason.',
  },
  {
    title: 'Dev mode only',
    body: 'Production builds send nothing. The extension only listens on localhost.',
  },
  {
    title: 'One theme, every component',
    body: 'Change --nd-color-primary once and the whole kit follows, written into styles.scss.',
  },
  {
    title: 'Inspector',
    body: 'Click any component and edit its inputs and text live. The template updates itself.',
  },
];
