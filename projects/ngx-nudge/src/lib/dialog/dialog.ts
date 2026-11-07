import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  model,
  viewChild,
} from '@angular/core';

/**
 * <ui-dialog [(open)]="show">
 *   <h3 uiDialogTitle>Title</h3>
 *   Body
 *   <div uiDialogActions><button ui-button>OK</button></div>
 * </ui-dialog>
 */
@Component({
  selector: 'ui-dialog',
  template: `
    <dialog #dlg (close)="open.set(false)" (click)="onBackdrop($event)">
      <div class="panel">
        <header class="header"><ng-content select="[uiDialogTitle]" /></header>
        <div class="body"><ng-content /></div>
        <footer class="footer"><ng-content select="[uiDialogActions]" /></footer>
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
    // backdrop par click ka target dialog khud hota hai, andar ka panel nahi
    if (e.target === this.dlg()?.nativeElement) this.open.set(false);
  }
}
