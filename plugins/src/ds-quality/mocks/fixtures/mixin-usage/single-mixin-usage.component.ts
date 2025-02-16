import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  styleUrls: ['./single-mixin-usage.component.scss'],
  selector: 'ds-accordion',
  template: ` <button class="single-mixin">click me!</button> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleMixinComponent {}
