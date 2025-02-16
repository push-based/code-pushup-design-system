import { Issue } from '@code-pushup/models';
import { Declaration, Rule } from 'postcss';
import {
  CssAstVisitor,
  DiagnosticsAware,
  styleAstRuleToSource,
} from '../../../../../../utils/src';
import { extractMixinNameRegex } from './constants';
import { DeprecationDefinition } from '../types';

export const createCssMixinUsageVisitor = (
  tokenReplacementDefinition: DeprecationDefinition,
  startLine = 0
): DiagnosticsAware & CssAstVisitor => {
  const { deprecatedEntity, replacement, docsUrl } = tokenReplacementDefinition;
  let diagnostics: (Issue & { code?: number })[] = [];

  return {
    getIssues() {
      return diagnostics;
    },

    clear(): void {
      diagnostics = [];
    },

    visitDecl(decl: Declaration) {
      const propVal = decl.value;
      const usedMixins = Array.from(
        propVal.matchAll(extractMixinNameRegex)
      ).map((match) => match[1]);

      if (usedMixins.length === 0) {
        return;
      }

      usedMixins.forEach((cssMixinName) => {
        if (deprecatedEntity === cssMixinName) {
          const message = generateCssMixinUsageMessage({
            cssMixin: cssMixinName,
            replacement,
            decl,
            docsUrl,
          });
          diagnostics.push({
            code: 2002,
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
 * Generate a message for a deprecated CSS mixin usage.
 *
 * @param cssVar - The CSS mixin name. e.g. `alert.default`.
 * @param docsUrl - The URL to the documentation page for the deprecated variable. e.g. `https://your-docs-link.com`.
 */
function generateCssMixinUsageMessage({
  replacement,
  cssMixin,
  decl,
  docsUrl,
}: {
  cssMixin: string;
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
  return `🎨 CSS mixin <code>${cssMixin}</code> on <code>${property}</code> of selector ${selector} is deprecated${replacementMsg}.${docsLink}`;
}
