import { Component } from '@angular/core';

@Component({
  styles: [`
    @import "./semantic-vars.scss";
    .score-primary {
      background: linear-gradient(var(--semantic-color-ds-deprecated-primary), var(--semantic-color-ds-deprecated-secondary), var(--semantic-color-ds-deprecated-accent));
    }
  `],
  selector: 'multi-val',
  template: `
    <span class="score-primary">Number: {{ num }}</span>
  `,
})
export class MultiVarComponent {
  num = 0;
}
