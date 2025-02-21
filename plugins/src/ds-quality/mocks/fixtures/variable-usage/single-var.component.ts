import { Component } from '@angular/core';

@Component({
  styles: [`
    @import "./semantic-vars.scss";
    .score-primary {
      background: var(--semantic-color-ds-deprecated-primary);
    }
  `],
  selector: 'single-val',
  template: `
    <span class="score-primary">Number: {{ num }}</span>
  `,
})
export class SingleVarComponent {
  num = 0;
}
