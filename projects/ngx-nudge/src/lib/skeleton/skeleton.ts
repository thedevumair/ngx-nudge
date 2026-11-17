import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** <nd-skeleton width="60%" />  <nd-skeleton shape="circle" width="40px" height="40px" /> */
@Component({
  selector: 'nd-skeleton',
  template: '',
  styles: `
    :host {
      display: block;
      border-radius: 6px;
      background: linear-gradient(
        90deg,
        color-mix(in srgb, var(--nd-color-text, #1f2937) 7%, transparent) 25%,
        color-mix(in srgb, var(--nd-color-text, #1f2937) 13%, transparent) 50%,
        color-mix(in srgb, var(--nd-color-text, #1f2937) 7%, transparent) 75%
      );
      background-size: 200% 100%;
      animation: nd-shimmer 1.4s ease-in-out infinite;
    }
    :host([data-shape='circle']) {
      border-radius: 50%;
    }
    :host([data-shape='rect']) {
      border-radius: var(--nd-radius, 8px);
    }
    @keyframes nd-shimmer {
      from {
        background-position: 200% 0;
      }
      to {
        background-position: -200% 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      :host {
        animation: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[style.width]': 'width()',
    '[style.height]': 'height()',
    '[attr.data-shape]': 'shape()',
  },
})
export class Skeleton {
  width = input('100%');
  height = input('14px');
  shape = input<'text' | 'circle' | 'rect'>('text');
}
