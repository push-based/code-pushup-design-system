import { Issue } from '@code-pushup/models';
import { Declaration } from 'postcss';
import { styleAstRuleToSource } from '../../styles/utils';
import { TokenReplacement } from './types';

export const createCssVarUsageVisitor = (
  tokenReplacement: TokenReplacement,
  startLine = 0
) => {
  let diagnostics: Issue[] = [];

  return {
    getIssues(): Issue[] {
      return diagnostics;
    },

    clear(): void {
      diagnostics = [];
    },

    visitDecl(decl: Declaration) {
      console.log(`visitDecl: ${decl.prop}`);

      // Extract CSS variable names
      const match = (decl.value.match(/var\((--[\w-]+)\)/g) || []).at(0);
      const cssVarName = match.replace(/var\(|\)/g, '').replace('--', ''); // Extract only variable name

      if (tokenReplacement.deprecatedTokens.includes(cssVarName)) {
        const message = generateCssVarUsageMessage({
          cssVar: cssVarName,
          property: decl.prop,
          docsUrl: 'https://your-docs-link.com',
        });
        diagnostics.push({
          message,
          severity: 'error',
          source: styleAstRuleToSource(decl),
        });
      }
    },
  };
};

function generateCssVarUsageMessage({
  cssVar,
  property,
  docsUrl,
}: {
  icon?: string;
  cssVar: string;
  property: string;
  docsUrl?: string;
}): string {
  const iconString = '🎨';
  const docsLink = docsUrl
    ? ` <a href="${docsUrl}" target="_blank">Learn more</a>.`
    : '';
  return `${iconString} The CSS variable <code>${cssVar}</code> in <code>${property}</code> is deprecated. Replace it with the recommended alternative.${docsLink}`;
}
