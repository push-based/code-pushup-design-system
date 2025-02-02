import { CssAstVisitor } from './stylesheet.visitor';
import { DiagnosticsAware } from './diagnostics.js';
import { Rule } from 'postcss';
import { Issue } from '@code-pushup/models';
import { stylesAstElementToIssue } from './utils';

export type ClassUsageStylesheetVisitor = CssAstVisitor & DiagnosticsAware;

export const createClassUsageStylesheetVisitor = (options: {
  classNames: string[];
}): ClassUsageStylesheetVisitor => {
  const { classNames: targetClassNames = [] } = options;
  const diagnostics: Issue[] = [];

  return {
    getIssue(): Issue[] {
      return diagnostics;
    },

    visitRule({ selector, source }) {
      matchingClassNames({ selector }, targetClassNames).forEach(
        (className) => {
          diagnostics.push(stylesAstElementToIssue(source, className));
        }
      );
    },
  };
};

function matchingClassNames(
  { selector }: Pick<Rule, 'selector'>,
  targetClassNames: string[]
): string[] {
  const classNames = selector.match(/\.[\w-]+/g) || [];
  // Strip off the leading "." from each match
  return classNames.filter((className) =>
    targetClassNames.includes(className.slice(1))
  );
}
