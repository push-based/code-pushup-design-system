import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BadAlertComponent } from './components/bad-alert.component';
import { BadAlertTooltipInputComponent } from './components/bad-alert-tooltip-input.component';
import { BadButtonDropdownComponent } from './components/bad-button-dropdown.component';
import { MixedStylesComponent } from './components/bad-mixed.component';
import { BadModalProgressComponent } from './components/bad-modal-progress.component';
import { BadMixedExternalAssetsComponent } from './components/bad-mixed-external-assets.component';
import { BadDocumentComponent } from './components/bad-document.component';
import { BadWindowComponent } from './components/bad-window.component';
import { BadThisWindowDocumentComponent } from './components/bad-this-window-document.component';
import { BadGlobalThisComponent } from './components/bad-global-this.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    BadAlertComponent,
    BadAlertTooltipInputComponent,
    BadModalProgressComponent,
    BadButtonDropdownComponent,
    MixedStylesComponent,
    BadMixedExternalAssetsComponent,
    BadDocumentComponent,
    BadGlobalThisComponent,
    BadWindowComponent,
    BadThisWindowDocumentComponent
  ],
  template: `
    <h1>{{ title }}</h1>
    <button class="btn">Sports</button>
    <app-bad-alert></app-bad-alert>
    <app-bad-alert-tooltip-input></app-bad-alert-tooltip-input>
    <app-bad-modal-progress></app-bad-modal-progress>
    <app-mixed-styles></app-mixed-styles>
    <app-bad-button-dropdown></app-bad-button-dropdown>
    <app-bad-mixed-external-assets></app-bad-mixed-external-assets>
    <app-bad-window></app-bad-window>
    <app-bad-this-window-document></app-bad-this-window-document>
    <app-bad-document></app-bad-document>
    <app-bad-global-this></app-bad-global-this>
    <router-outlet />
  `,
})
export class AppComponent {
  title = 'minimal';
}
