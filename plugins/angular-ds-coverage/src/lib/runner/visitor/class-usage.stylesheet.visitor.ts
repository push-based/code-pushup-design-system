import { CssAstVisitor } from './stylesheet.visitor';
import { DiagnosticsAware } from './diagnostics.js';
import { Rule } from 'postcss';
import { Issue } from '@code-pushup/models';
import { ComponentReplacement } from '@code-pushup-design-system/angular-ds-coverage';

export type ClassUsageStylesheetVisitor = CssAstVisitor & DiagnosticsAware;

export function stylesAstRuleToIssue(
  { source }: Rule,
  message: string
): Issue {
  return {
    message: message ?? 'Wrong class usage in component styles. Replace it with the appropriate DS component for consistency.',
    severity: 'info',
    source: {
      file: source?.input.file ?? '',
      position: {
        startLine: source?.start?.line ?? 0,
        endLine: source?.end?.line ?? 0,
        startColumn: source?.start?.column ?? 0,
        endColumn: source?.end?.column ?? 0,
      },
    },
  };
}


export const createClassUsageStylesheetVisitor = (
  componentReplacement: ComponentReplacement
): ClassUsageStylesheetVisitor => {
  const { matchingCssClasses = [] } = componentReplacement;
  const diagnostics: Issue[] = [];

  return {
    getIssue(): Issue[] {
      return diagnostics;
    },

    visitRule(rule: Rule) {
      getMatchingClassNames(
        { selector: rule.selector },
        matchingCssClasses
      ).forEach((className) => {
        const message = generateStylesheetUsageMessage(
          className,
          rule.selector
        );
        diagnostics.push(stylesAstRuleToIssue(rule, message));
      });
    },
  };
};

function generateStylesheetUsageMessage(
  className: string,
  selector: string
): string {
  return `The class "${className}" is used in the selector "${selector}" within the component styles. Replace it with the appropriate DS component for consistency.`;
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
