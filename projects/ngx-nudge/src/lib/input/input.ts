import { ChangeDetectionStrategy, Component, ElementRef, inject, input } from '@angular/core';
import { registerInspectable } from '../core/inspect';

/**
 * <input nd-input placeholder="Name" />
 * <textarea nd-input></textarea>
 * Invalid state: aria-invalid="true"
 */
@Component({
  selector: 'input[nd-input], textarea[nd-input]',
  template: '',
  styleUrl: './input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInput {
  syncId = input<string>();

  constructor() {
    const el = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;
    registerInspectable({
      label: 'Input',
      syncId: () => this.syncId(),
      props: [
        {
          name: 'placeholder',
          kind: 'text',
          default: '',
          get: () => el.placeholder,
          set: (v) => (el.placeholder = String(v)),
        },
        {
          name: 'disabled',
          kind: 'boolean',
          default: false,
          get: () => el.disabled,
          set: (v) => (el.disabled = !!v),
        },
      ],
    });
  }
}
