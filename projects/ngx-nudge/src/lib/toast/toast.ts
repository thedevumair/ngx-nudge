import { ChangeDetectionStrategy, Component, Injectable, inject, signal } from '@angular/core';

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';

export interface Toast {
  id: number;
  title: string;
  message?: string;
  variant: ToastVariant;
}

export interface ToastOptions {
  title: string;
  message?: string;
  variant?: ToastVariant;
  /** Milliseconds before it closes itself; 0 keeps it open. Default 4000. */
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly items = signal<Toast[]>([]);
  readonly toasts = this.items.asReadonly();
  private seq = 0;

  show(options: ToastOptions): number {
    const toast: Toast = {
      id: ++this.seq,
      title: options.title,
      message: options.message,
      variant: options.variant ?? 'info',
    };
    this.items.update((list) => [...list, toast]);
    const duration = options.duration ?? 4000;
    if (duration > 0) setTimeout(() => this.dismiss(toast.id), duration);
    return toast.id;
  }

  success(title: string, message?: string): number {
    return this.show({ title, message, variant: 'success' });
  }

  error(title: string, message?: string): number {
    return this.show({ title, message, variant: 'danger' });
  }

  dismiss(id: number): void {
    this.items.update((list) => list.filter((t) => t.id !== id));
  }
}

/** Place once in your root template: <nd-toaster /> */
@Component({
  selector: 'nd-toaster',
  template: `
    <div class="stack" role="region" aria-label="Notifications" aria-live="polite">
      @for (t of toasts.toasts(); track t.id) {
        <div class="toast" role="status" [attr.data-variant]="t.variant">
          <span class="bar" aria-hidden="true"></span>
          <div class="text">
            <strong>{{ t.title }}</strong>
            @if (t.message) {
              <p>{{ t.message }}</p>
            }
          </div>
          <button type="button" class="x" aria-label="Dismiss" (click)="toasts.dismiss(t.id)">
            ×
          </button>
        </div>
      }
    </div>
  `,
  styleUrl: './toast.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toaster {
  readonly toasts = inject(ToastService);
}
