import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Usage:
 *   <nd-card>
 *     <h3 ndCardHeader>Title</h3>
 *     Body content
 *     <div ndCardFooter><button nd-button>OK</button></div>
 *   </nd-card>
 */
@Component({
  selector: 'nd-card',
  template: `
    <header class="header"><ng-content select="[ndCardHeader]" /></header>
    <div class="body"><ng-content /></div>
    <footer class="footer"><ng-content select="[ndCardFooter]" /></footer>
  `,
  styleUrl: './card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {}
