export interface ThemeToken {
  group: string;
  name: string;
  label: string;
  type: 'color' | 'px';
  default: string;
  min?: number;
  max?: number;
}

/**
 * Every design token the kit reads, with its default value.
 * The defaults here must match the fallbacks written in each component's CSS.
 */
export const TOKENS: ThemeToken[] = [
  {
    group: 'Global',
    name: '--nd-color-primary',
    label: 'Primary colour',
    type: 'color',
    default: '#3b5bdb',
  },
  {
    group: 'Global',
    name: '--nd-color-primary-contrast',
    label: 'Text on primary',
    type: 'color',
    default: '#ffffff',
  },
  {
    group: 'Global',
    name: '--nd-color-surface',
    label: 'Surface',
    type: 'color',
    default: '#ffffff',
  },
  { group: 'Global', name: '--nd-color-text', label: 'Text', type: 'color', default: '#222222' },
  {
    group: 'Global',
    name: '--nd-color-border',
    label: 'Border',
    type: 'color',
    default: '#dddddd',
  },
  {
    group: 'Global',
    name: '--nd-color-focus',
    label: 'Focus ring',
    type: 'color',
    default: '#4c8bf5',
  },
  {
    group: 'Global',
    name: '--nd-radius',
    label: 'Corner radius',
    type: 'px',
    default: '6px',
    min: 0,
    max: 24,
  },
  {
    group: 'Global',
    name: '--nd-font-size',
    label: 'Font size',
    type: 'px',
    default: '14px',
    min: 10,
    max: 22,
  },

  {
    group: 'Status',
    name: '--nd-color-success',
    label: 'Success',
    type: 'color',
    default: '#2f9e44',
  },
  {
    group: 'Status',
    name: '--nd-color-warning',
    label: 'Warning',
    type: 'color',
    default: '#e67700',
  },
  {
    group: 'Status',
    name: '--nd-color-danger',
    label: 'Danger',
    type: 'color',
    default: '#e03131',
  },

  {
    group: 'Button',
    name: '--nd-button-pad-y',
    label: 'Padding vertical',
    type: 'px',
    default: '8px',
    min: 0,
    max: 24,
  },
  {
    group: 'Button',
    name: '--nd-button-pad-x',
    label: 'Padding horizontal',
    type: 'px',
    default: '16px',
    min: 0,
    max: 40,
  },

  {
    group: 'Card',
    name: '--nd-card-pad',
    label: 'Padding',
    type: 'px',
    default: '16px',
    min: 0,
    max: 40,
  },

  {
    group: 'Input',
    name: '--nd-input-pad-y',
    label: 'Padding vertical',
    type: 'px',
    default: '8px',
    min: 0,
    max: 24,
  },
  {
    group: 'Input',
    name: '--nd-input-pad-x',
    label: 'Padding horizontal',
    type: 'px',
    default: '12px',
    min: 0,
    max: 32,
  },

  {
    group: 'Table',
    name: '--nd-table-header-bg',
    label: 'Header background',
    type: 'color',
    default: '#f3f4f6',
  },
  {
    group: 'Table',
    name: '--nd-table-header-color',
    label: 'Header text',
    type: 'color',
    default: '#222222',
  },
  {
    group: 'Table',
    name: '--nd-table-stripe-bg',
    label: 'Row stripe',
    type: 'color',
    default: '#fafafa',
  },
  {
    group: 'Table',
    name: '--nd-table-pad-y',
    label: 'Padding vertical',
    type: 'px',
    default: '8px',
    min: 0,
    max: 32,
  },
  {
    group: 'Table',
    name: '--nd-table-pad-x',
    label: 'Padding horizontal',
    type: 'px',
    default: '12px',
    min: 0,
    max: 32,
  },
];
