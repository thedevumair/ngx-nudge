import { Injectable } from '@angular/core';
import { syncTokens } from 'ngx-nudge';

const PRESETS: Record<string, Record<string, string>> = {
  Light: {
    '--nd-color-primary': '#4f46e5',
    '--nd-color-primary-contrast': '#ffffff',
    '--nd-color-surface': '#ffffff',
    '--nd-color-text': '#1f2937',
    '--nd-color-border': '#e5e7eb',
  },
  Dark: {
    '--nd-color-primary': '#748ffc',
    '--nd-color-primary-contrast': '#111827',
    '--nd-color-surface': '#1b1e27',
    '--nd-color-text': '#e6e8ee',
    '--nd-color-border': '#343a4a',
  },
  Rose: {
    '--nd-color-primary': '#d6336c',
    '--nd-color-primary-contrast': '#ffffff',
    '--nd-color-surface': '#fff7fa',
    '--nd-color-text': '#3b1f2b',
    '--nd-color-border': '#f0c9d6',
  },
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly presetNames = Object.keys(PRESETS);

  apply(name: string): void {
    const tokens = PRESETS[name];
    for (const [key, value] of Object.entries(tokens)) {
      document.documentElement.style.setProperty(key, value);
    }
    syncTokens(tokens); // write to styles.scss (unsaved)
    window.dispatchEvent(new Event('nd-theme-change')); // refresh the theme panel sliders
  }
}
