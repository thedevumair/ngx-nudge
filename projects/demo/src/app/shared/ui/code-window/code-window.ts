import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { LiveCode } from './live-code';

@Component({
  selector: 'app-code-window',
  templateUrl: './code-window.html',
  styleUrl: './code-window.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeWindow {
  files = input.required<LiveCode[]>();
  active = model.required<string>();

  readonly current = computed(
    () => this.files().find((f) => f.name === this.active()) ?? this.files()[0],
  );
}
