import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  contentChildren,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

let uid = 0;

/** One tab. Its content is rendered only while it is selected. */
@Component({
  selector: 'nd-tab',
  template: '<ng-template><ng-content /></ng-template>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tab {
  label = input.required<string>();
  disabled = input(false);
  readonly content = viewChild.required(TemplateRef);
}

/**
 * <nd-tabs [(selected)]="index">
 *   <nd-tab label="Profile">...</nd-tab>
 *   <nd-tab label="Billing">...</nd-tab>
 * </nd-tabs>
 */
@Component({
  selector: 'nd-tabs',
  imports: [NgTemplateOutlet],
  template: `
    <div class="list" role="tablist" (keydown)="onKey($event)">
      @for (t of tabs(); track $index; let i = $index) {
        <button
          type="button"
          role="tab"
          class="tab"
          [id]="id + '-tab-' + i"
          [class.on]="i === selected()"
          [attr.aria-selected]="i === selected()"
          [attr.aria-controls]="id + '-panel'"
          [tabindex]="i === selected() ? 0 : -1"
          [disabled]="t.disabled()"
          (click)="selected.set(i)"
        >
          {{ t.label() }}
        </button>
      }
    </div>
    @if (tabs()[selected()]; as t) {
      <div
        class="panel"
        role="tabpanel"
        tabindex="0"
        [id]="id + '-panel'"
        [attr.aria-labelledby]="id + '-tab-' + selected()"
      >
        <ng-container [ngTemplateOutlet]="t.content()" />
      </div>
    }
  `,
  styleUrl: './tabs.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tabs {
  readonly tabs = contentChildren(Tab);
  selected = model(0);
  readonly id = `nd-tabs-${++uid}`;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  onKey(e: KeyboardEvent): void {
    const count = this.tabs().length;
    if (!count) return;
    let next = this.selected();
    if (e.key === 'ArrowRight') next = (next + 1) % count;
    else if (e.key === 'ArrowLeft') next = (next - 1 + count) % count;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = count - 1;
    else return;
    e.preventDefault();
    this.selected.set(next);
    queueMicrotask(() => this.host.querySelector<HTMLElement>(`#${this.id}-tab-${next}`)?.focus());
  }
}
