import {
  CssAstVisitor,
  DiagnosticsAware,
  styleAstRuleToSource,
} from '../../../../../../utils/src';
import { Rule } from 'postcss';
import { Issue } from '@code-pushup/models';

import {
  EXTERNAL_ASSET_ICON,
  INLINE_ASSET_ICON,
  STYLES_ASSET_ICON,
} from './constants';
import { ComponentReplacement } from './types';

export type ClassDefinitionVisitor = CssAstVisitor & DiagnosticsAware;

export const createClassDefinitionVisitor = (
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
          componentName: componentReplacement.componentName,
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
  componentName,
  docsUrl,
}: Pick<ComponentReplacement, 'componentName' | 'docsUrl'> & {
  className: string;
  rule: Rule;
}): string {
  const isInline = rule.source?.input.file?.match(/\.ts$/) != null;
  const iconString = `${
    isInline ? INLINE_ASSET_ICON : EXTERNAL_ASSET_ICON
  }${STYLES_ASSET_ICON} `;
  const docsLink = docsUrl
    ? ` <a href="${docsUrl}" target="_blank">Learn more</a>.`
    : '';
  return `${iconString}️ The selector's class <code>${className}</code> is deprecated. Use <code>${componentName}</code> and delete the styles.${docsLink}`;
}

export function getMatchingClassNames(
  { selector }: Pick<Rule, 'selector'>,
  targetClassNames: string[]
): string[] {
  const classNames = selector.match(/\.[\w-]+/g) || [];
  return classNames
    .map((className) => className.slice(1)) // Strip the leading "."
    .filter((className) => targetClassNames.includes(className));
}
