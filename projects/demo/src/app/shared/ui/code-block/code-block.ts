import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-code-block',
  template: `
    <div class="wrap">
      <button type="button" class="copy" (click)="copy()">
        {{ copied() ? 'Copied' : 'Copy' }}
      </button>
      <pre><code>{{ code() }}</code></pre>
    </div>
  `,
  styles: `
    .wrap {
      position: relative;
    }
    pre {
      margin: 0;
      padding: 16px;
      overflow: auto;
      font-size: 12px;
      line-height: 1.6;
      border: 1px solid var(--nd-color-border, #ddd);
      border-radius: var(--nd-radius, 6px);
      background: color-mix(in srgb, var(--nd-color-text, #222) 5%, var(--nd-color-surface, #fff));
    }
    .copy {
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 4px 10px;
      font: inherit;
      font-size: 12px;
      color: inherit;
      background: var(--nd-color-surface, #fff);
      border: 1px solid var(--nd-color-border, #ddd);
      border-radius: 6px;
      cursor: pointer;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeBlock {
  code = input.required<string>();
  copied = signal(false);

  copy(): void {
    navigator.clipboard?.writeText(this.code()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }
}
