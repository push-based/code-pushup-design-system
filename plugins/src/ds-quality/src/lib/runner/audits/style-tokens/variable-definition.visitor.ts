import { Issue } from '@code-pushup/models';
import { Declaration, Rule } from 'postcss';
import { styleAstRuleToSource } from '../../../../../../utils/src';
import { TokenReplacementDefinition } from './types';
import { extractCssVariableNameRegex } from './constants';

export const createCssVarUsageVisitor = (
  tokenReplacementDefinition: TokenReplacementDefinition,
  startLine = 0
) => {
  const { deprecatedToken, tokenReplacement, docsUrl } =
    tokenReplacementDefinition;
  let diagnostics: Issue[] = [];

  return {
    getIssues(): Issue[] {
      return diagnostics;
    },

    clear(): void {
      diagnostics = [];
    },

    visitDecl(decl: Declaration) {
      const propVal = decl.value;

      const usedVariables = [
        ...propVal.matchAll(extractCssVariableNameRegex),
      ].map((match) => match[1]);
      // if the property value does not contain a CSS variable, return
      if (usedVariables.length === 0) {
        return;
      }

      usedVariables.forEach((cssVarName) => {
        if (deprecatedToken === cssVarName) {
          const message = generateCssVarUsageMessage({
            cssVar: cssVarName,
            replacement: tokenReplacement,
            decl,
            docsUrl,
          });
          diagnostics.push({
            message,
            severity: 'error',
            source: styleAstRuleToSource(decl.parent as Rule, startLine),
          });
        }
      });
    },
  };
};

/**
 * Generate a message for a deprecated CSS variable usage.
 *
 * @param cssVar - The CSS variable name. e.g. `--color-primary`.
 * @param property - The CSS property where the variable is used. e.g. `color`.
 * @param docsUrl - The URL to the documentation page for the deprecated variable. e.g. `https://your-docs-link.com`.
 */
function generateCssVarUsageMessage({
  replacement,
  cssVar,
  decl,
  docsUrl,
}: {
  cssVar: string;
  decl: Declaration;
  replacement?: string;
  docsUrl?: string;
}): string {
  const property = decl.prop;
  const selector = (decl.parent as Rule)?.selector ?? '';
  const replacementMsg = replacement
    ? ` use <code>${replacement}</code> instead`
    : '';

  const docsLink = docsUrl
    ? ` <a href="${docsUrl}" target="_blank">Learn more</a>.`
    : '';
  return `🎨 CSS variable <code>${cssVar}</code> on <code>${property}</code> of selector ${selector} is deprecated${replacementMsg}.${docsLink}`;
}
