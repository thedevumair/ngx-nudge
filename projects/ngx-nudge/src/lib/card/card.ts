import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Usage:
 *   <ui-card>
 *     <h3 uiCardHeader>Title</h3>
 *     Body content
 *     <div uiCardFooter><button ui-button>OK</button></div>
 *   </ui-card>
 */
@Component({
  selector: 'ui-card',
  template: `
    <header class="header"><ng-content select="[uiCardHeader]" /></header>
    <div class="body"><ng-content /></div>
    <footer class="footer"><ng-content select="[uiCardFooter]" /></footer>
  `,
  styleUrl: './card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {}
