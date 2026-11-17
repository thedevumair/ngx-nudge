import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  input,
  model,
  viewChild,
} from '@angular/core';

export type DialogSize = 'sm' | 'md' | 'lg';

/**
 * <nd-dialog [(open)]="show">
 *   <h3 ndDialogTitle>Title</h3>
 *   Body
 *   <div ndDialogActions><button nd-button>OK</button></div>
 * </nd-dialog>
 */
@Component({
  selector: 'nd-dialog',
  template: `
    <dialog #dlg [attr.data-size]="size()" (close)="open.set(false)" (click)="onBackdrop($event)">
      <div class="panel">
        <header class="header">
          <div class="title"><ng-content select="[ndDialogTitle]" /></div>
          @if (closable()) {
            <button type="button" class="close" aria-label="Close" (click)="open.set(false)">
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
            </button>
          }
        </header>
        <div class="body"><ng-content /></div>
        <footer class="footer"><ng-content select="[ndDialogActions]" /></footer>
      </div>
    </dialog>
  `,
  styleUrl: './dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dialog {
  open = model(false);
  size = input<DialogSize>('md');
  closable = input(true);
  private readonly dlg = viewChild<ElementRef<HTMLDialogElement>>('dlg');

  constructor() {
    effect(() => {
      const isOpen = this.open();
      const el = this.dlg()?.nativeElement;
      if (!el) return;
      if (isOpen && !el.open) el.showModal();
      else if (!isOpen && el.open) el.close();
    });
  }

  onBackdrop(e: MouseEvent): void {
    // a backdrop click targets the dialog itself, not the inner panel
    if (e.target === this.dlg()?.nativeElement) this.open.set(false);
  }
}
