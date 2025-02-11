import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'class-binding',
  template: `<button [class.btn]>Click me</button>`,
})
export class ClassAttributeUsageComponent {}
