import { Component } from '@angular/core';

@Component({
  styleUrls: ['./accordion.component.scss'],
  selector: 'ds-accordion',
  template: `
    <div class="ds-accordion-header-wrapper">
      <ng-content select="ds-accordion-header" />
    </div>

    <div class="ds-accordion-content"></div>
  `,
})
export class DsAccordion {}
