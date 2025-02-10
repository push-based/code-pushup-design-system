import { Component } from '@angular/core';

@Component({
  template: `<button class="btn">Click me</button>`, // should create issue with startLine: 4, endLine: 4
  selector: 'inl-tmpl-single',
})
export class InlTmplSingleComponent {}
