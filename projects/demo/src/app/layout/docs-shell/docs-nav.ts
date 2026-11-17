export interface NavLink {
  path: string;
  label: string;
}

export interface NavGroup {
  group: string;
  links: NavLink[];
}

export const DOCS_NAV: NavGroup[] = [
  {
    group: 'Start',
    links: [
      { path: '/docs/getting-started', label: 'Getting started' },
      { path: '/docs/gallery', label: 'All components' },
    ],
  },
  {
    group: 'Examples',
    links: [
      { path: '/orders', label: 'Orders' },
      { path: '/starter', label: 'Admin starter' },
    ],
  },
  {
    group: 'Actions',
    links: [
      { path: '/docs/button', label: 'Button' },
    ],
  },
  {
    group: 'Forms',
    links: [
      { path: '/docs/input', label: 'Input' },
      { path: '/docs/select', label: 'Select' },
      { path: '/docs/field', label: 'Field' },
      { path: '/docs/checkbox', label: 'Checkbox' },
      { path: '/docs/radio', label: 'Radio' },
      { path: '/docs/switch', label: 'Switch' },
      { path: '/docs/autocomplete', label: 'Autocomplete' },
    ],
  },
  {
    group: 'Data display',
    links: [
      { path: '/docs/table', label: 'Table' },
      { path: '/docs/grid', label: 'Dashboard grid' },
      { path: '/docs/card', label: 'Card' },
      { path: '/docs/badge', label: 'Badge' },
      { path: '/docs/avatar', label: 'Avatar' },
    ],
  },
  {
    group: 'Navigation',
    links: [
      { path: '/docs/tabs', label: 'Tabs' },
      { path: '/docs/menu', label: 'Menu' },
      { path: '/docs/breadcrumb', label: 'Breadcrumb' },
      { path: '/docs/pagination', label: 'Pagination' },
    ],
  },
  {
    group: 'Feedback',
    links: [
      { path: '/docs/alert', label: 'Alert' },
      { path: '/docs/toast', label: 'Toast' },
      { path: '/docs/dialog', label: 'Dialog' },
      { path: '/docs/tooltip', label: 'Tooltip' },
      { path: '/docs/spinner', label: 'Spinner' },
      { path: '/docs/progress', label: 'Progress' },
      { path: '/docs/skeleton', label: 'Skeleton' },
    ],
  },
];
