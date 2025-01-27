import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nx-welcome',
  imports: [CommonModule],
  template: `
    <style>
      .btn {
        font-size: 1.5em;
        color: #333;
      }
    </style>
    <h1>Title</h1>
    <button class="btn">Click me</button>
  `,
  styles: [
    `
      .btn {
        font-size: 1.2em;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class NxWelcomeComponent {}
