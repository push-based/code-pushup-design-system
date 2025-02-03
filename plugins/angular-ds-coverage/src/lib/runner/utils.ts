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
import { ComponentReplacement } from '@code-pushup-design-system/angular-ds-coverage';

export function getClassUsageIssues(
  components: ResolvedComponent[],
  compReplacement: ComponentReplacement
) {
  return components.flatMap((component) => {
    const { template, templateUrl, filePath } = component;
    const visitor = new ClassUsageTemplateVisitor(compReplacement);
    const nodes = template?.ast.nodes ?? templateUrl?.ast.nodes ?? [];
    visitEachTmplChild(nodes, visitor);

    return visitor.getIssues().map((issue) => {
      return {
        ...issue,
        message: `${templateUrl ? '🔗' : '✏️'}${issue.message}`,
        source: {
          ...issue.source,
          file: templateUrl
            ? path.join(path.dirname(filePath), templateUrl.value)
            : filePath,
          position:
            template?.startLine != null
              ? startFromPosition(issue, {
                  startLine: template.startLine,
                })
              : issue?.source?.position,
        },
      };
    });
  });
}

export function getClassDefinitionIssues(
  components: ResolvedComponent[],
  componentReplacement: ComponentReplacement
) {
  return components.flatMap((component) => {
    const {
      styles = [],
      styleUrls = [],
      filePath: componentFilePath,
    } = component;

    const stylesVisitor =
      createClassUsageStylesheetVisitor(componentReplacement);

    return [
      ...styles.flatMap((style) => {
        stylesVisitor.reset();
        visitEachStyleNode(style.ast, stylesVisitor);

        return stylesVisitor.getIssues().map((issue) => {
          return {
            ...issue,
            message: `✏️${issue.message}`,
            source: {
              ...issue.source,
              file: componentFilePath,
              position: startFromPosition(issue, {
                startLine: style.startLine,
              }),
            },
          };
        });
      }),
      ...styleUrls.flatMap((styleUrl) => {
        stylesVisitor.reset();
        visitEachStyleNode(styleUrl.ast, stylesVisitor);
        return stylesVisitor.getIssues().map((issue) => {
          return {
            ...issue,
            message: `🔗${issue.message}`,
            source: {
              ...issue.source,
              file: path.join(path.dirname(componentFilePath), styleUrl.value),
            },
          };
        });
      }),
    ];
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

type Source = Exclude<Issue['source'], undefined>;
type Position = Exclude<Source['position'], undefined>;

export function startFromPosition(
  issue: Partial<Issue>,
  position: Position
): Position {
  return {
    ...issue.source?.position,
    startLine: (issue.source?.position?.startLine ?? 0) + position.startLine,
    ...(issue.source?.position?.endLine !== undefined
      ? { endLine: (issue.source?.position?.endLine ?? 0) + position.startLine }
      : {}),
  };
}
