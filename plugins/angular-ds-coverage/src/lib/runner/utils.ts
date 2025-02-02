import { ResolvedComponent } from './types';
import { AuditOutput, Issue } from '@code-pushup/models';
import path from 'node:path';
import { ClassUsageTemplateVisitor } from './visitor/class-usage.template.visitor';
import { createClassUsageStylesheetVisitor } from './visitor/class-usage.stylesheet.visitor';
import { pluralize } from '@code-pushup/utils';
import {
  visitEachStyleNode,
  visitEachTmplChild,
} from './visitor/template.walk';

export function getClassUsageIssues(
  components: ResolvedComponent[],
  matchingCssClasses: string[]
) {
  return components.flatMap((component) => {
    const { template, templateUrl } = component;
    const visitor = new ClassUsageTemplateVisitor(matchingCssClasses);
    const nodes = template?.ast.nodes ?? templateUrl?.ast.nodes ?? [];
    visitEachTmplChild(nodes, visitor);

    return visitor.getIssue().map((issue) => {
      return adjustIssueSource(component, issue);
    });
  });
}

export function getClassDefinitionIssues(
  components: ResolvedComponent[],
  matchingCssClasses: string[]
) {
  return components.flatMap((component) => {
    const { styles = [], styleUrls = [] } = component;
    const visitor = createClassUsageStylesheetVisitor({
      classNames: matchingCssClasses,
    });
    return [...styles, ...styleUrls].flatMap((style) => {
      visitEachStyleNode(style.ast, visitor);
      return visitor.getIssue().map((issue) => {
        return adjustIssueSource(component, issue);
      });
    });
  });
}

/**
 * Creates a scored audit output.
 * @param slug
 * @param issues
 * @returns Audit output.
 */
export function getAuditOutput(slug: string, issues: Issue[]): AuditOutput {
  return {
    slug,
    displayValue: `${issues.length} ${pluralize('class', issues.length)} found`,
    score: issues.length === 0 ? 1 : 0,
    value: issues.length,
    details: {
      issues,
    },
  };
}

/**
 * Converts matching `TmplAstElement's` from a visitor into Issues.
 * @param component Component that contains the matching elements. Used to get the template start line in order to calculate the real line of the issue.
 * @param issue
 * @returns Array of Issues.
 */
export function adjustIssueSource(
  component: ResolvedComponent,
  issue: Issue
): Issue {
  const { template, templateUrl, filePath } = component;
  return {
    ...issue,
    source: {
      file: templateUrl
        ? path.join(path.dirname(filePath), templateUrl.value)
        : filePath,
      position: {
        startLine:
          (issue?.source?.position?.startLine ?? 0) +
          (template?.startLine ?? 0) +
          1, // +1 because the line number in the report is 1-indexed
      },
    },
  };
}
