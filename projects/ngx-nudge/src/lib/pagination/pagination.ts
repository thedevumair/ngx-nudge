import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { pageWindow } from './pagination-logic';

/** <nd-pagination [total]="240" [pageSize]="10" [(page)]="page" />  (page is 1-based) */
@Component({
  selector: 'nd-pagination',
  template: `
    <nav class="pg" aria-label="Pagination">
      <button
        type="button"
        class="btn"
        aria-label="Previous page"
        [disabled]="page() <= 1"
        (click)="go(page() - 1)"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 4l-4 4 4 4" /></svg>
      </button>
      @for (p of pages(); track $index) {
        @if (p === '…') {
          <span class="gap" aria-hidden="true">…</span>
        } @else {
          <button
            type="button"
            class="btn num"
            [class.on]="p === page()"
            [attr.aria-current]="p === page() ? 'page' : null"
            [attr.aria-label]="'Page ' + p"
            (click)="go(+p)"
          >
            {{ p }}
          </button>
        }
      }
      <button
        type="button"
        class="btn"
        aria-label="Next page"
        [disabled]="page() >= count()"
        (click)="go(page() + 1)"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 4l4 4-4 4" /></svg>
      </button>
    </nav>
  `,
  styles: `
    .pg {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
    }
    .btn {
      display: grid;
      place-items: center;
      min-width: 34px;
      height: 34px;
      padding: 0 8px;
      font: inherit;
      font-size: 14px;
      font-weight: 600;
      color: var(--nd-color-text, #1f2937);
      background: var(--nd-color-surface, #ffffff);
      border: 1px solid var(--nd-color-border, #e5e7eb);
      border-radius: var(--nd-radius, 8px);
      cursor: pointer;
      transition:
        border-color 0.15s,
        color 0.15s;
    }
    .btn:hover:not(:disabled):not(.on) {
      color: var(--nd-color-primary, #4f46e5);
      border-color: var(--nd-color-primary, #4f46e5);
    }
    .btn:focus-visible {
      outline: 2px solid var(--nd-color-primary, #4f46e5);
      outline-offset: 2px;
    }
    .btn:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .on {
      color: var(--nd-color-primary-contrast, #ffffff);
      background: var(--nd-color-primary, #4f46e5);
      border-color: var(--nd-color-primary, #4f46e5);
    }
    .gap {
      min-width: 20px;
      text-align: center;
      opacity: 0.5;
    }
    svg {
      width: 14px;
      height: 14px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  total = input.required<number>();
  pageSize = input(10);
  page = model(1);

  readonly count = computed(() =>
    Math.max(1, Math.ceil(this.total() / Math.max(1, this.pageSize()))),
  );
  readonly pages = computed(() => pageWindow(this.page(), this.count()));

  go(p: number): void {
    this.page.set(Math.min(Math.max(1, p), this.count()));
  }
}
