import { describe, expect, it } from 'vitest';
import { createCssVarUsageVisitor } from './variable-usage.visitor';
import postcss from 'postcss';
import { visitEachChild } from '../../../../../../utils/src';

describe('createCssVarUsageVisitor', () => {
  let tokenAstVisitor: ReturnType<typeof createCssVarUsageVisitor>;

  it('should find tokens', () => {
    const styles = `.btn { color: var(--primary-color-btn); }`;

    tokenAstVisitor = createCssVarUsageVisitor({
      replacement: 'primary-color-btn-new',
      deprecatedEntity: 'primary-color-btn',
      docsUrl: '',
    });

    const ast = postcss.parse(styles, { from: 'styles.css' });

    visitEachChild(ast, tokenAstVisitor);

    expect(tokenAstVisitor?.getIssues?.()).toStrictEqual([
      {
        message: `🎨 The CSS variable <code>primary-color-btn</code> in <code>color</code> is deprecated. Replace it with the recommended alternative. <a href="https://your-docs-link.com" target="_blank">Learn more</a>.`,
        severity: 'error',
        source: {
          file: expect.stringMatching(/ds-quality\/styles\.css$/),
          position: {
            endColumn: 39,
            endLine: 1,
            startColumn: 8,
            startLine: 1,
          },
        },
      },
    ]);
  });
});
