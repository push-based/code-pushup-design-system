import { Component } from '@angular/core';

@Component({
  styles: [`
    :root {
      --primary-color: #ff0000;
      --secondary-color: #00ff00;
      --accent-color: #0000ff;
    }
    .score-primary {
      background: linear-gradient(var(--semantic-color-ds-deprecated-primary), var(--semantic-color-ds-deprecated-secondary), var(--semantic-color-ds-deprecated-accent));
    }
  `],
  selector: 'multi-val',
  template: `
    <span class="score-primary">Number: {{ num }}</span>
  `,
})
export class MultiValComponent {
  num = 0;
}
