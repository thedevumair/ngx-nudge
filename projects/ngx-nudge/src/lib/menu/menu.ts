import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

let uid = 0;

/** <button type="button" nd-menu-item>Edit</button> */
@Component({
  selector: 'button[nd-menu-item], a[nd-menu-item]',
  template: '<ng-content />',
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      box-sizing: border-box;
      padding: 8px 10px;
      font: inherit;
      font-size: 14px;
      text-align: left;
      text-decoration: none;
      color: var(--nd-color-text, #1f2937);
      background: transparent;
      border: 0;
      border-radius: 6px;
      cursor: pointer;
    }
    :host(:hover),
    :host(:focus) {
      outline: none;
      background: color-mix(in srgb, var(--nd-color-primary, #4f46e5) 9%, transparent);
    }
    :host([data-variant='danger']) {
      color: var(--nd-color-danger, #e03131);
    }
    :host([data-variant='danger']:hover),
    :host([data-variant='danger']:focus) {
      background: color-mix(in srgb, var(--nd-color-danger, #e03131) 9%, transparent);
    }
    :host([disabled]) {
      opacity: 0.45;
      pointer-events: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'menuitem', tabindex: '-1', '[attr.data-variant]': 'variant()' },
})
export class MenuItem {
  variant = input<'default' | 'danger'>('default');
}

/**
 * <button nd-button [ndMenuTrigger]="actions">Actions</button>
 * <nd-menu #actions>
 *   <button type="button" nd-menu-item (click)="edit()">Edit</button>
 *   <button type="button" nd-menu-item variant="danger">Delete</button>
 * </nd-menu>
 */
@Component({
  selector: 'nd-menu',
  template: `
    @if (open()) {
      <div
        #panel
        class="panel"
        role="menu"
        [id]="id"
        [attr.aria-label]="label()"
        [style.top.px]="top()"
        [style.left.px]="left()"
        (keydown)="onKey($event)"
        (click)="onClick($event)"
      >
        <ng-content />
      </div>
    }
  `,
  styleUrl: './menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu {
  label = input('Menu');

  readonly id = `nd-menu-${++uid}`;
  readonly open = signal(false);
  readonly top = signal(0);
  readonly left = signal(0);

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private trigger?: HTMLElement;

  private readonly onOutside = (e: PointerEvent) => {
    const target = e.target as Node;
    if (this.panel()?.nativeElement.contains(target) || this.trigger?.contains(target)) return;
    this.close(false);
  };
  private readonly onViewportChange = () => this.close(false);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.unlisten());
  }

  toggle(trigger: HTMLElement): void {
    if (this.open()) this.close();
    else this.openAt(trigger);
  }

  openAt(trigger: HTMLElement): void {
    this.trigger = trigger;
    const r = trigger.getBoundingClientRect();
    this.top.set(r.bottom + 6);
    this.left.set(r.left);
    this.open.set(true);

    document.addEventListener('pointerdown', this.onOutside, true);
    window.addEventListener('scroll', this.onViewportChange, true);
    window.addEventListener('resize', this.onViewportChange);

    // After it renders: keep it on screen, then focus the first item
    requestAnimationFrame(() => {
      const el = this.panel()?.nativeElement;
      if (!el) return;
      const p = el.getBoundingClientRect();
      if (p.bottom > window.innerHeight - 8) this.top.set(Math.max(8, r.top - p.height - 6));
      if (p.right > window.innerWidth - 8)
        this.left.set(Math.max(8, window.innerWidth - p.width - 8));
      this.items()[0]?.focus();
    });
  }

  close(refocus = true): void {
    if (!this.open()) return;
    this.open.set(false);
    this.unlisten();
    if (refocus) this.trigger?.focus();
  }

  onKey(e: KeyboardEvent): void {
    const items = this.items();
    const i = items.indexOf(document.activeElement as HTMLElement);
    switch (e.key) {
      case 'ArrowDown':
        items[(i + 1) % items.length]?.focus();
        break;
      case 'ArrowUp':
        items[i <= 0 ? items.length - 1 : i - 1]?.focus();
        break;
      case 'Home':
        items[0]?.focus();
        break;
      case 'End':
        items[items.length - 1]?.focus();
        break;
      case 'Escape':
        this.close();
        break;
      case 'Tab':
        this.close(false);
        return;
      default:
        return;
    }
    e.preventDefault();
  }

  onClick(e: MouseEvent): void {
    if ((e.target as Element).closest('[role="menuitem"]')) this.close();
  }

  private items(): HTMLElement[] {
    const el = this.panel()?.nativeElement;
    return el
      ? Array.from(el.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])'))
      : [];
  }

  private unlisten(): void {
    document.removeEventListener('pointerdown', this.onOutside, true);
    window.removeEventListener('scroll', this.onViewportChange, true);
    window.removeEventListener('resize', this.onViewportChange);
  }
}

@Directive({
  selector: '[ndMenuTrigger]',
  host: {
    'aria-haspopup': 'menu',
    '[attr.aria-expanded]': 'menu().open()',
    '[attr.aria-controls]': 'menu().open() ? menu().id : null',
    '(click)': 'menu().toggle(el)',
    '(keydown.arrowdown)': 'openFromKey($event)',
  },
})
export class MenuTrigger {
  menu = input.required<Menu>({ alias: 'ndMenuTrigger' });
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  openFromKey(e: Event): void {
    e.preventDefault();
    if (!this.menu().open()) this.menu().openAt(this.el);
  }
}
