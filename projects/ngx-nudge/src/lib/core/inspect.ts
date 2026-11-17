import { DestroyRef, ElementRef, Signal, computed, inject, isDevMode, signal } from '@angular/core';

export type PropKind = 'text' | 'number' | 'boolean' | 'select' | 'columns';

export interface InspectableProp {
  /** Input name as written in the template, or '$text' for the element's text content. */
  name: string;
  kind: PropKind;
  options?: readonly string[];
  default: unknown;
  get(): unknown;
  set(value: unknown): void;
  /** True when the component writes this prop to source itself (for example the columns array). */
  selfSync?: boolean;
}

export interface Inspectable {
  element: HTMLElement;
  label: string;
  syncId(): string | undefined;
  props: InspectableProp[];
}

export interface InspectableDef {
  label: string;
  syncId(): string | undefined;
  props: InspectableProp[];
  /** Adds a '$text' prop for elements whose content is plain text (button, badge). */
  text?: boolean;
}

const registry = new Map<HTMLElement, Inspectable>();

/** Wraps an input so the inspector can override it live; the input itself stays untouched. */
export function overridable<T>(source: Signal<T>) {
  const override = signal<{ v: T } | null>(null);
  return {
    value: computed(() => {
      const o = override();
      return o ? o.v : source();
    }),
    set: (v: T) => override.set({ v }),
  };
}

/** Registers the host element with the inspector. Call it from a component constructor. Dev mode only. */
export function registerInspectable(def: InspectableDef): void {
  if (!isDevMode()) return;
  const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  const props = [...def.props];

  if (def.text) {
    props.push({
      name: '$text',
      kind: 'text',
      default: undefined,
      get: () => element.textContent?.trim() ?? '',
      set: (v) => {
        // Only plain text is replaced; elements with child nodes are left alone
        const plain = [...element.childNodes].every((n) => n.nodeType === Node.TEXT_NODE);
        if (plain) element.textContent = String(v);
      },
    });
  }

  registry.set(element, { element, label: def.label, syncId: def.syncId, props });
  inject(DestroyRef).onDestroy(() => registry.delete(element));
}

/** Walks up from the clicked node to the nearest registered component. */
export function findInspectable(target: EventTarget | null): Inspectable | undefined {
  let el = target instanceof Element ? target : null;
  while (el) {
    const hit = registry.get(el as HTMLElement);
    if (hit) return hit;
    el = el.parentElement;
  }
  return undefined;
}

/** Registers a native checkbox, switch or radio: checked and disabled. */
export function registerToggle(label: string, syncId: () => string | undefined): void {
  if (!isDevMode()) return;
  const el = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;
  registerInspectable({
    label,
    syncId,
    props: [
      {
        name: 'checked',
        kind: 'boolean',
        default: false,
        get: () => el.checked,
        set: (v) => (el.checked = !!v),
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
