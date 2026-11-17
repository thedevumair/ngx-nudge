import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { overridable, registerInspectable } from '../core/inspect';

export type AvatarSize = 'sm' | 'md' | 'lg';

/** <nd-avatar name="Ayesha Khan" /> or <nd-avatar name="Ayesha Khan" [src]="photoUrl" /> */
@Component({
  selector: 'nd-avatar',
  template: `
    @if (src() && !failed()) {
      <img [src]="src()" alt="" (error)="failed.set(true)" />
    } @else {
      <span aria-hidden="true">{{ initials() }}</span>
    }
  `,
  styleUrl: './avatar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'img',
    '[attr.aria-label]': 'nameValue()',
    '[attr.data-size]': 'sizeValue()',
    '[style.background]': 'color()',
  },
})
export class Avatar {
  name = input.required<string>();
  src = input<string>();
  size = input<AvatarSize>('md');
  syncId = input<string>();

  private readonly nameOv = overridable(this.name);
  private readonly sizeOv = overridable(this.size);
  protected readonly nameValue = this.nameOv.value;
  protected readonly sizeValue = this.sizeOv.value;

  readonly failed = signal(false);

  readonly initials = computed(() =>
    this.nameValue()
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join(''),
  );

  /** A stable colour per name, so the same person always looks the same. */
  readonly color = computed(() => {
    let hash = 0;
    for (const ch of this.nameValue()) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
    return `hsl(${Math.abs(hash) % 360} 55% 46%)`;
  });

  constructor() {
    registerInspectable({
      label: 'Avatar',
      syncId: () => this.syncId(),
      props: [
        {
          name: 'name',
          kind: 'text',
          default: undefined,
          get: this.nameValue,
          set: (v) => this.nameOv.set(String(v)),
        },
        {
          name: 'size',
          kind: 'select',
          options: ['sm', 'md', 'lg'],
          default: 'md',
          get: this.sizeValue,
          set: (v) => this.sizeOv.set(v as AvatarSize),
        },
      ],
    });
  }
}
