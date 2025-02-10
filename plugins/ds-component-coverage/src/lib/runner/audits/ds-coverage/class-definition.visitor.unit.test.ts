import { describe, expect, it } from 'vitest';
import { createClassDefenitionVisitor } from './class-definition.visitor';
import postcss from 'postcss';
import { visitEachChild } from '../../styles/stylesheet.walk';

describe('ClassUsageStylesheetVisitor', () => {
  let cssAstVisitor: ReturnType<typeof createClassDefenitionVisitor>;

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

    cssAstVisitor = createClassDefenitionVisitor({
      matchingCssClasses: ['btn'],
      componentName: 'DsButton',
    });

    const ast = postcss.parse(styles, { from: 'styles.css' });

    visitEachChild(ast, cssAstVisitor);

    expect(cssAstVisitor?.getIssues?.()).toStrictEqual([
      {
        filePath:
          '/Users/michael_hladky/WebstormProjects/code-pushup-design-system/plugins/ds-component-coverage/styles.css',
        length: 4,
        message: 'Class ".btn" is used in the stylesheet.',
        severity: 'info',
        start: 60,
      },
      {
        filePath:
          '/Users/michael_hladky/WebstormProjects/code-pushup-design-system/plugins/ds-component-coverage/styles.css',
        length: 4,
        message: 'Class ".btn" is used in the stylesheet.',
        severity: 'info',
        start: 283,
      },
    ]);
  });
});
