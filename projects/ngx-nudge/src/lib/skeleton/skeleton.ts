import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { overridable, registerInspectable } from '../core/inspect';

export type SkeletonShape = 'text' | 'circle' | 'rect';

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
    :host([data-shape='circle']) { border-radius: 50%; }
    :host([data-shape='rect']) { border-radius: var(--nd-radius, 8px); }
    @keyframes nd-shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
    @media (prefers-reduced-motion: reduce) { :host { animation: none; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[style.width]': 'widthValue()',
    '[style.height]': 'heightValue()',
    '[attr.data-shape]': 'shapeValue()',
  },
})
export class Skeleton {
  width = input('100%');
  height = input('14px');
  shape = input<SkeletonShape>('text');
  syncId = input<string>();

  private readonly widthOv = overridable(this.width);
  private readonly heightOv = overridable(this.height);
  private readonly shapeOv = overridable(this.shape);
  protected readonly widthValue = this.widthOv.value;
  protected readonly heightValue = this.heightOv.value;
  protected readonly shapeValue = this.shapeOv.value;

  constructor() {
    registerInspectable({
      label: 'Skeleton',
      syncId: () => this.syncId(),
      props: [
        { name: 'width', kind: 'text', default: '100%', get: this.widthValue, set: (v) => this.widthOv.set(String(v)) },
        { name: 'height', kind: 'text', default: '14px', get: this.heightValue, set: (v) => this.heightOv.set(String(v)) },
        { name: 'shape', kind: 'select', options: ['text', 'circle', 'rect'], default: 'text', get: this.shapeValue, set: (v) => this.shapeOv.set(v as SkeletonShape) },
      ],
    });
  }
}
