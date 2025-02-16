import { Issue } from '@code-pushup/models';
import { Rule } from 'postcss';
import {
  CssAstVisitor,
  DiagnosticsAware,
  styleAstRuleToSource,
} from '../../../../../../utils/src';
import { DeprecationDefinition } from '../types';
import AtRule from 'postcss/lib/at-rule.js';

export const createCssMixinUsageVisitor = (
  tokenReplacementDefinition: DeprecationDefinition,
  startLine = 0
): DiagnosticsAware & CssAstVisitor => {
  const { deprecatedEntity, replacement, docsUrl } = tokenReplacementDefinition;
  let diagnostics: (Issue & { code?: number })[] = [];

  const visitor = {
    getIssues() {
      return diagnostics;
    },

    clear(): void {
      diagnostics = [];
    },

    visitAtRule(atRule: AtRule) {
      const atRuleName = atRule.name;

      // only check for @include at-rule
      if (atRuleName !== 'include') {
        return;
      }
      const mixinName = atRule.params;

      if (deprecatedEntity === mixinName) {
        const message = generateCssMixinUsageMessage({
          cssMixin: mixinName,
          replacement,
          atRule,
          docsUrl,
        });
        diagnostics.push({
          code: 2002,
          message,
          severity: 'error',
          source: styleAstRuleToSource(atRule.parent as Rule, startLine),
        });
      }
    },
  };

  return visitor;
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
  atRule,
  docsUrl,
}: {
  cssMixin: string;
  atRule: AtRule;
  replacement?: string;
  docsUrl?: string;
}): string {
  const selector = (atRule.parent as Rule)?.selector ?? '';
  const replacementMsg = replacement
    ? ` use <code>${replacement}</code> instead`
    : '';

  const docsLink = docsUrl
    ? ` <a href="${docsUrl}" target="_blank">Learn more</a>.`
    : '';
  return `🎨 Mixin <code>${cssMixin}</code> included in selector <code>${selector}</code> is deprecated${replacementMsg}.${docsLink}`;
}
