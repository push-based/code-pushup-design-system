import { Issue } from '@code-pushup/models';
import { Rule, AtRule } from 'postcss';
import {
  CssAstVisitor,
  DiagnosticsAware,
  styleAstRuleToSource,
} from '../../../../../../utils/src';
import { useImportRegex } from './constants';
import { DeprecationDefinition } from '../types';
import {  ISSUE_CODES } from '../constants';

export const createCssMixinImportVisitor = (
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

    visitAtRule(atRule: AtRule) {
      const atRuleName = atRule.name;

      // only check for `@use` at-rules
      if (atRuleName !== 'use') {
        return;
      }

      const [_, __, importAlias] = atRule.params.match(useImportRegex) ?? [];

      if (importAlias == null) {
        return;
      }
      const [deprecatedImportAlias] = deprecatedEntity.split('.');
      if (deprecatedImportAlias === importAlias) {
        const message = generateCssMixinImportMessage({
          replacement,
          atRule,
          docsUrl,
        });
        diagnostics.push({
          code: ISSUE_CODES.MixinImport,
          message,
          severity: 'error',
          source: styleAstRuleToSource(atRule.parent as Rule, startLine),
        });
      }
    },
  };
};

/**
 * Generate a message for a deprecated CSS mixin usage.
 *
 * @param cssVar - The CSS mixin name. e.g. `alert.default`.
 * @param docsUrl - The URL to the documentation page for the deprecated variable. e.g. `https://your-docs-link.com`.
 */
function generateCssMixinImportMessage({
  replacement,
  atRule,
  docsUrl,
}: {
  atRule: AtRule;
  replacement?: string;
  docsUrl?: string;
}): string {
  const [_, importPath, importAlias] =
    atRule.params.match(useImportRegex) ?? [];
  const replacementMsg = replacement
    ? ` use <code>${replacement}</code> instead`
    : '';

  const docsLink = docsUrl
    ? ` <a href="${docsUrl}" target="_blank">Learn more</a>.`
    : '';
  return `🎨 <code>@use</code> imports <code>${importPath}</code> as <code>${importAlias}</code> is deprecated${replacementMsg}.${docsLink}`;
}
