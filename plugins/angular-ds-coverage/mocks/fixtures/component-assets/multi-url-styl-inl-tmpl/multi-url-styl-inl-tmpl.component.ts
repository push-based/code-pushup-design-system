import { Component } from '@angular/core';

@Component({
  selector: 'multi-url-styl-inl-tmpl',
  template: `<button class="">Click me</button>`,
  styles: [
    `
      .legacy-button {
        color: green;
      }
    `,
    `
      .btn-secondary {
        color: orange;
      }
    `,
  ],
  styleUrls: [
    './multi-url-styl-inl-tmpl-1.component.css',
    './multi-url-styl-inl-tmpl-2.component.css',
  ],
})
export class MultiUrlStylInlTmplComponent {}
