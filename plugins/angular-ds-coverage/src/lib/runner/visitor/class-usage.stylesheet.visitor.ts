import { CssAstVisitor } from './stylesheet.visitor';
import { DiagnosticsAware } from './diagnostics.js';
import { Rule } from 'postcss';
import { Issue } from '@code-pushup/models';
import { ComponentReplacement } from '@code-pushup-design-system/angular-ds-coverage';

export type ClassUsageStylesheetVisitor = CssAstVisitor & DiagnosticsAware;

export function stylesAstRuleToIssue({ source }: Rule, message: string): Issue {
  return {
    message:
      message ??
      'Wrong class usage in component styles. Replace it with the appropriate DS component for consistency.',
    severity: 'error',
    source: {
      file: source?.input.file ?? '',
      position: {
        startLine: source?.start?.line ?? 0,
        startColumn: source?.start?.column ?? 0,
        endLine: source?.end?.line ?? 0,
        endColumn: source?.end?.column ?? 0,
      },
    },
  };
}

export const createClassUsageStylesheetVisitor = (
  componentReplacement: ComponentReplacement
): ClassUsageStylesheetVisitor => {
  const { matchingCssClasses = [] } = componentReplacement;
  let diagnostics: Issue[] = [];

  return {
    getIssues(): Issue[] {
      return diagnostics;
    },

    reset(): void {
      diagnostics = [];
    },

    visitRule(rule: Rule) {
      getMatchingClassNames(
        { selector: rule.selector },
        matchingCssClasses
      ).forEach((className) => {
        const message = generateStylesheetUsageMessage({
          className,
          selector: rule.selector,
          dsComponentName: componentReplacement.componentName,
          docsUrl: componentReplacement.docsUrl,
        });
        diagnostics.push(stylesAstRuleToIssue(rule, message));
      });
    },
  };
};

function generateStylesheetUsageMessage({
  className,
  selector,
  dsComponentName = 'a DS component',
  docsUrl,
  icon = '🎨',
}: {
  icon?: string;
  className: string;
  selector: string;
  dsComponentName?: string;
  docsUrl?: string;
}): string {
  const iconString = icon ? `${icon} ` : '';
  const docsLink = docsUrl
    ? ` <a href="${docsUrl}" target="_blank">Learn more</a>.`
    : '';
  return `${iconString}️ The selector's class <code>${className}</code> is deprecated. Use <code>${dsComponentName}</code> and delete the styles.${docsLink}`;
}

function getMatchingClassNames(
  { selector }: Pick<Rule, 'selector'>,
  targetClassNames: string[]
): string[] {
  const classNames = selector.match(/\.[\w-]+/g) || [];
  return classNames
    .map((className) => className.slice(1)) // Strip the leading "."
    .filter((className) => targetClassNames.includes(className));
}
