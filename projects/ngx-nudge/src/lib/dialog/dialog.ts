import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  model,
  viewChild,
} from '@angular/core';

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
    <dialog #dlg (close)="open.set(false)" (click)="onBackdrop($event)">
      <div class="panel">
        <header class="header"><ng-content select="[ndDialogTitle]" /></header>
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
  private dlg = viewChild<ElementRef<HTMLDialogElement>>('dlg');

  constructor() {
    effect(() => {
      const isOpen = this.open();
      const el = this.dlg()?.nativeElement;
      if (!el) return;
      if (isOpen && !el.open) el.showModal();
      else if (!isOpen && el.open) el.close();
    });
  }

  onBackdrop(e: MouseEvent) {
    // a backdrop click targets the dialog itself, not the inner panel
    if (e.target === this.dlg()?.nativeElement) this.open.set(false);
  }
}
