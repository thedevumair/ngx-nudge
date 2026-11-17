import { DestroyRef, Directive, ElementRef, inject, input, signal } from '@angular/core';

let uid = 0;

const STYLE: Partial<CSSStyleDeclaration> = {
  position: 'fixed',
  zIndex: '10000',
  maxWidth: '240px',
  padding: '6px 10px',
  font: '500 12px/1.4 system-ui, sans-serif',
  color: 'var(--nd-tooltip-color, #ffffff)',
  background: 'var(--nd-tooltip-bg, #111827)',
  borderRadius: '6px',
  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2)',
  pointerEvents: 'none',
};

/** <button nd-button ndTooltip="Copies the link">Share</button> */
@Directive({
  selector: '[ndTooltip]',
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(focusin)': 'show()',
    '(focusout)': 'hide()',
    '(keydown.escape)': 'hide()',
    '[attr.aria-describedby]': 'open() ? id : null',
  },
})
export class Tooltip {
  text = input.required<string>({ alias: 'ndTooltip' });
  placement = input<'top' | 'bottom'>('top', { alias: 'ndTooltipPlacement' });

  readonly id = `nd-tooltip-${++uid}`;
  readonly open = signal(false);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private tip?: HTMLElement;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.hide());
  }

  show(): void {
    if (this.tip || !this.text()) return;
    const tip = document.createElement('div');
    tip.id = this.id;
    tip.setAttribute('role', 'tooltip');
    tip.textContent = this.text();
    Object.assign(tip.style, STYLE);
    document.body.appendChild(tip);

    const r = this.el.getBoundingClientRect();
    const t = tip.getBoundingClientRect();
    let top = this.placement() === 'top' ? r.top - t.height - 8 : r.bottom + 8;
    if (top < 4) top = r.bottom + 8; // flip below when there is no room above
    const left = Math.min(
      Math.max(r.left + r.width / 2 - t.width / 2, 4),
      window.innerWidth - t.width - 4,
    );
    tip.style.top = `${top}px`;
    tip.style.left = `${left}px`;

    this.tip = tip;
    this.open.set(true);
  }

  hide(): void {
    this.tip?.remove();
    this.tip = undefined;
    this.open.set(false);
  }
}
