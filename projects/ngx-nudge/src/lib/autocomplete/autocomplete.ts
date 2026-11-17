import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  linkedSignal,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { filterOptions, splitMatch } from './autocomplete-logic';

let uid = 0;

/**
 * <nd-autocomplete [options]="cities" [(value)]="city" placeholder="City" />
 * Also works with [(ngModel)] and formControlName.
 */
@Component({
  selector: 'nd-autocomplete',
  template: `
    <input
      class="field"
      type="text"
      role="combobox"
      autocomplete="off"
      aria-autocomplete="list"
      [id]="id + '-input'"
      [placeholder]="placeholder()"
      [value]="query()"
      [disabled]="disabled()"
      [attr.aria-expanded]="open()"
      [attr.aria-controls]="id + '-list'"
      [attr.aria-activedescendant]="open() && active() >= 0 ? id + '-opt-' + active() : null"
      (input)="onInput($any($event.target).value)"
      (keydown)="onKey($event)"
      (focus)="open.set(true)"
      (blur)="onBlur()"
    />
    @if (open() && results().length) {
      <ul class="list" role="listbox" [id]="id + '-list'">
        @for (o of results(); track o; let i = $index) {
          @let parts = split(o);
          <li
            role="option"
            [id]="id + '-opt-' + i"
            [class.active]="i === active()"
            [attr.aria-selected]="o === value()"
            (mousedown)="$event.preventDefault()"
            (mouseenter)="active.set(i)"
            (click)="choose(o)"
          >
            {{ parts[0] }}<mark>{{ parts[1] }}</mark
            >{{ parts[2] }}
          </li>
        }
      </ul>
    } @else if (open() && query()) {
      <div class="list empty">No matches</div>
    }
  `,
  styleUrl: './autocomplete.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Autocomplete), multi: true },
  ],
})
export class Autocomplete implements ControlValueAccessor {
  options = input.required<readonly string[]>();
  placeholder = input('');
  value = model<string | null>(null);

  readonly id = `nd-ac-${++uid}`;
  /** What is typed; follows the value whenever the value changes from outside. */
  readonly query = linkedSignal(() => this.value() ?? '');
  readonly open = signal(false);
  readonly active = signal(-1);
  readonly disabled = signal(false);
  readonly results = computed(() => filterOptions(this.options(), this.query()));

  private onChange: (v: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  split(label: string): [string, string, string] {
    return splitMatch(label, this.query());
  }

  onInput(text: string): void {
    this.query.set(text);
    this.open.set(true);
    this.active.set(0);
    if (!text) this.commit(null);
  }

  onKey(e: KeyboardEvent): void {
    const n = this.results().length;
    switch (e.key) {
      case 'ArrowDown':
        this.open.set(true);
        this.active.set(n ? (this.active() + 1) % n : -1);
        break;
      case 'ArrowUp':
        this.active.set(n ? (this.active() <= 0 ? n - 1 : this.active() - 1) : -1);
        break;
      case 'Enter': {
        const option = this.results()[this.active()];
        if (!this.open() || !option) return;
        this.choose(option);
        break;
      }
      case 'Escape':
        if (!this.open()) return;
        this.open.set(false);
        break;
      default:
        return;
    }
    e.preventDefault();
  }

  choose(option: string): void {
    this.commit(option);
    this.query.set(option);
    this.open.set(false);
  }

  onBlur(): void {
    this.open.set(false);
    this.onTouched();
    // Typed text that was never chosen goes back to the current value
    if (this.query() !== (this.value() ?? '')) this.query.set(this.value() ?? '');
  }

  writeValue(v: string | null): void {
    this.value.set(v ?? null);
  }

  registerOnChange(fn: (v: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }

  private commit(v: string | null): void {
    this.value.set(v);
    this.onChange(v);
  }
}
