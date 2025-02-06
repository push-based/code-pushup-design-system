import { CssAstVisitor } from '../../styles/stylesheet.visitor';
import { DiagnosticsAware } from '../../utils/diagnostics.js';
import { Root, Rule } from 'postcss';
import { Issue } from '@code-pushup/models';
import { ComponentReplacement } from '@code-pushup-design-system/angular-ds-coverage';
import {
  EXTERNAL_ASSET_ICON,
  INLINE_ASSET_ICON,
  STYLES_ASSET_ICON,
} from './constants';
import {
  getMatchingClassNames,
  styleAstRuleToSource,
} from '../../styles/utils';

export type ClassDefinitionVisitor = CssAstVisitor & DiagnosticsAware;

export const createClassUsageStylesheetVisitor = (
  componentReplacement: ComponentReplacement,
  startLine = 0
): ClassDefinitionVisitor => {
  const { matchingCssClasses = [] } = componentReplacement;
  let diagnostics: Issue[] = [];

  return {
    getIssues(): Issue[] {
      return diagnostics;
    },

    clear(): void {
      diagnostics = [];
    },

    visitRule(rule: Rule) {
      getMatchingClassNames(
        { selector: rule.selector },
        matchingCssClasses
      ).forEach((className) => {
        const message = generateStylesheetUsageMessage({
          className,
          rule,
          dsComponentName: componentReplacement.componentName,
          docsUrl: componentReplacement.docsUrl,
        });

        diagnostics.push({
          message,
          severity: 'error',
          source: styleAstRuleToSource(rule, startLine),
        });
      });
    },
  };
};

function generateStylesheetUsageMessage({
  className,
  rule,
  dsComponentName = 'a DS component',
  docsUrl,
}: {
  icon?: string;
  className: string;
  rule: Rule;
  dsComponentName?: string;
  docsUrl?: string;
}): string {
  const isInline = rule.source?.input.file?.match(/\.ts$/) == null;
  const iconString = `${
    isInline ? INLINE_ASSET_ICON : EXTERNAL_ASSET_ICON
  }${STYLES_ASSET_ICON} `;
  const docsLink = docsUrl
    ? ` <a href="${docsUrl}" target="_blank">Learn more</a>.`
    : '';
  return `${iconString}️ The selector's class <code>${className}</code> is deprecated. Use <code>${dsComponentName}</code> and delete the styles.${docsLink}`;
}
