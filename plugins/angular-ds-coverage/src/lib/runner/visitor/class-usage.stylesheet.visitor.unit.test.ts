import { describe, expect, it } from 'vitest';
import { createClassUsageStylesheetVisitor } from './class-usage.stylesheet.visitor';
import postcss from 'postcss';
import { beforeEach } from 'node:test';
import { visitEachChild } from './stylesheet.walk';

describe('ClassUsageStylesheetVisitor', () => {
  let cssAstVisitor: ReturnType<typeof createClassUsageStylesheetVisitor>;

  beforeEach(() => {});

  it('should not find class when it is not a class-binding', () => {
    const styles = `
                /* This comment is here */
                .btn {
                  color: red;
                }

                #btn-1 {
                  color: green;
                }

                button {
                  color: blue;
                }

                div > button.btn {
                  color: blue;
                }
             `;

    cssAstVisitor = createClassUsageStylesheetVisitor({ classNames: ['btn'] });

    const ast = postcss.parse(styles, { from: 'styles.css' });

    visitEachChild(ast, cssAstVisitor);

    expect(cssAstVisitor?.getIssues?.()).toStrictEqual([
      {
        filePath:
          '/Users/michael_hladky/WebstormProjects/code-pushup-design-system/plugins/angular-ds-coverage/styles.css',
        length: 4,
        message: 'Class ".btn" is used in the stylesheet.',
        severity: 'info',
        start: 60,
      },
      {
        filePath:
          '/Users/michael_hladky/WebstormProjects/code-pushup-design-system/plugins/angular-ds-coverage/styles.css',
        length: 4,
        message: 'Class ".btn" is used in the stylesheet.',
        severity: 'info',
        start: 283,
      },
    ]);
  });
});
