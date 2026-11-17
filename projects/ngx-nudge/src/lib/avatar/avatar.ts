import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

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
    '[attr.aria-label]': 'name()',
    '[attr.data-size]': 'size()',
    '[style.background]': 'color()',
  },
})
export class Avatar {
  name = input.required<string>();
  src = input<string>();
  size = input<AvatarSize>('md');

  readonly failed = signal(false);

  readonly initials = computed(() =>
    this.name()
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join(''),
  );

  /** A stable colour per name, so the same person always looks the same. */
  readonly color = computed(() => {
    let hash = 0;
    for (const ch of this.name()) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
    return `hsl(${Math.abs(hash) % 360} 55% 46%)`;
  });
}
