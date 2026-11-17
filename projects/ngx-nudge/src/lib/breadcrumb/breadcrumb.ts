import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * <nd-breadcrumb>
 *   <a nd-crumb routerLink="/">Home</a>
 *   <a nd-crumb routerLink="/projects">Projects</a>
 *   <span nd-crumb [current]="true">Settings</span>
 * </nd-breadcrumb>
 */
@Component({
  selector: 'nd-breadcrumb',
  template: '<ng-content />',
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'navigation', 'aria-label': 'Breadcrumb' },
})
export class Breadcrumb {}

@Component({
  selector: 'a[nd-crumb], span[nd-crumb]',
  template: '<ng-content />',
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: color-mix(in srgb, var(--nd-color-text, #1f2937) 58%, transparent);
      text-decoration: none;
    }
    :host(:not(:first-child))::before {
      content: '/';
      color: color-mix(in srgb, var(--nd-color-text, #1f2937) 30%, transparent);
    }
    :host(a:hover) {
      color: var(--nd-color-primary, #4f46e5);
    }
    :host([aria-current='page']) {
      font-weight: 600;
      color: var(--nd-color-text, #1f2937);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.aria-current]': "current() ? 'page' : null" },
})
export class Crumb {
  current = input(false);
}
