import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button, ToastService, ToastVariant } from 'ngx-nudge';
import { ApiRow, ApiTable } from '../../../shared/ui/api-table/api-table';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';
import { Preview } from '../../../shared/ui/preview/preview';

const CODE = `// app.html
<nd-toaster />

// any component
private readonly toast = inject(ToastService);

save() {
  this.toast.success('Saved', 'Your changes are live.');
}`;

const API: ApiRow[] = [
  { name: "show(options)", type: "{ title, message?, variant?, duration? }", default: "duration 4000", description: "Shows a toast; returns its id." },
  { name: "success(title, message?)", type: "method", default: "\u2014", description: "Green toast." },
  { name: "error(title, message?)", type: "method", default: "\u2014", description: "Red toast." },
  { name: "dismiss(id)", type: "method", default: "\u2014", description: "Closes one toast." },
];

@Component({
  selector: 'app-toast-page',
  imports: [Button, DocPage, Preview, CodeBlock, ApiTable],
  templateUrl: './toast-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastPage {
  readonly code = CODE;
  readonly api = API;
  private readonly toast = inject(ToastService);
  readonly variants: ToastVariant[] = ['info', 'success', 'warning', 'danger'];

  notify(variant: ToastVariant): void {
    const text: Record<ToastVariant, [string, string]> = {
      info: ['Heads up', 'A new version is available.'],
      success: ['Saved', 'Your changes are live.'],
      warning: ['Almost full', 'You have used 90% of your storage.'],
      danger: ['Payment failed', 'Please update your card.'],
    };
    const [title, message] = text[variant];
    this.toast.show({ title, message, variant });
  }
}
