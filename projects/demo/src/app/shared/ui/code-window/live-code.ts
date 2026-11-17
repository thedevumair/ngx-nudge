import { Signal, WritableSignal, computed, signal } from '@angular/core';
import { CodeLine } from './code-line';

/** One file in the code window: its lines, which lines just changed, and whether it is "unsaved". */
export class LiveCode {
  readonly version = signal(0);
  readonly dirty = signal(false);
  readonly lines: Signal<CodeLine[]>;

  private readonly raw: Signal<CodeLine[]>;
  private readonly before: WritableSignal<string[]>;

  constructor(
    readonly name: string,
    source: () => CodeLine[],
  ) {
    this.raw = computed(source);
    this.before = signal(this.raw().map((l) => l.text));
    this.lines = computed(() => {
      const index = new Map(this.before().map((t, i) => [t, i] as const));
      let last = -1;
      // A line is "changed" if it is new, or if it moved above a line that used to come after it
      return this.raw().map((l) => {
        const was = index.get(l.text);
        if (was === undefined) return { ...l, changed: true };
        const moved = was < last;
        last = Math.max(last, was);
        return { ...l, changed: moved };
      });
    });
  }

  /** Applies a state change and highlights the lines it touched. */
  change(apply: () => void): void {
    this.before.set(this.raw().map((l) => l.text));
    apply();
    this.dirty.set(true);
    this.version.update((v) => v + 1);
  }

  /** Forgets highlights and the unsaved mark (call after resetting state). */
  reset(): void {
    this.before.set(this.raw().map((l) => l.text));
    this.dirty.set(false);
  }
}
