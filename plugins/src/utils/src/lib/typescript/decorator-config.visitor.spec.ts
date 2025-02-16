import { classDecoratorVisitor } from './decorator-config.visitor';
import * as ts from 'typescript';

describe('DecoratorConfigVisitor', () => {

  it.skip('should not find class when it is not a class-binding', () => {
    const sourceCode = `
  class Example {
    method() {}
  }

  function greet() {
    console.log('Hello');
  }

  let x = 123;
`;

    const sourceFile = ts.createSourceFile(
      'example.ts',
      sourceCode,
      ts.ScriptTarget.Latest,
      true
    );

    const visitor  = classDecoratorVisitor({ sourceFile })
    ts.visitNode(sourceFile, visitor);

    expect(visitor.components).toEqual([]);
  });

  it('should not find class when it is not a class-binding', () => {
    const sourceCode = `
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'minimal';
}
`;

    const sourceFile = ts.createSourceFile(
      'example.ts',
      sourceCode,
      ts.ScriptTarget.Latest,
      true
    );
    const visitor  = classDecoratorVisitor({ sourceFile })

    ts.visitNode(sourceFile, visitor);

    expect(visitor.components).toStrictEqual([
      {
        className: 'AppComponent',
        decoratorName: 'Component',
        filePath: 'example.ts',
        styleUrls: [
          {
            startLine: 8,
            value: './app.component.css',
          },
        ],
        templateUrl: {
          startLine: 7,
          value: './app.component.html',
        },
      },
    ]);
  });
});
