import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Dialog,
  Field,
  Progress,
  Radio,
  Select,
  Spinner,
  Switch,
  Tab,
  Tabs,
  TextInput,
  ToastService,
  ToastVariant,
  Tooltip,
  Autocomplete,
  Breadcrumb,
  Crumb,
  Menu,
  MenuItem,
  MenuTrigger,
  Pagination,
  Skeleton,
} from 'ngx-nudge';
import { DocPage } from '../../../shared/ui/doc-page/doc-page';

const TOASTS: Record<ToastVariant, [string, string]> = {
  info: ['Heads up', 'A new version is available.'],
  success: ['Saved', 'Your changes are live.'],
  warning: ['Almost full', 'You have used 90% of your storage.'],
  danger: ['Payment failed', 'Please update your card.'],
};

@Component({
  selector: 'app-gallery-page',
  imports: [
    Alert,
    Avatar,
    Badge,
    Button,
    Card,
    Checkbox,
    Dialog,
    Field,
    Progress,
    Radio,
    Select,
    Spinner,
    Switch,
    Tab,
    Tabs,
    TextInput,
    Tooltip,
    DocPage,
    Autocomplete,
    Breadcrumb,
    Crumb,
    Menu,
    MenuItem,
    MenuTrigger,
    Pagination,
    Skeleton,
    RouterLink,
  ],
  templateUrl: './gallery-page.html',
  styleUrl: './gallery-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryPage {
  private readonly toast = inject(ToastService);

  readonly people = ['Ayesha Khan', 'Bilal Ahmed', 'Sana Malik', 'Usman Raza', 'Hira Siddiqui'];
  readonly toastVariants: ToastVariant[] = ['info', 'success', 'warning', 'danger'];
  readonly dialogOpen = signal(false);
  readonly saving = signal(false);
  readonly progress = signal(64);
  readonly tab = signal(0);
  readonly cities = [
    'Karachi',
    'Lahore',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Sialkot',
    'Hyderabad',
  ];
  readonly city = signal<string | null>(null);
  readonly page = signal(5);
  readonly loading = signal(true);

  action(name: string): void {
    this.toast.show({ title: name, message: 'Menu item clicked.' });
  }

  notify(v: ToastVariant): void {
    const [title, message] = TOASTS[v];
    this.toast.show({ title, message, variant: v });
  }

  save(): void {
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      this.toast.success('Saved', 'Your changes are live.');
    }, 1200);
  }

  step(by: number): void {
    this.progress.update((p) => Math.min(100, Math.max(0, p + by)));
  }
}
