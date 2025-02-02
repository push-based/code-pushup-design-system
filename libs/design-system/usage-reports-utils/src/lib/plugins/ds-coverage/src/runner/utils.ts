import { ResolvedComponent } from './types';

import { TmplAstElement } from '@angular/compiler';
import { Audit, AuditOutput, Issue } from '@code-pushup/models';
import path from 'node:path';
import { ComponentReplacement } from '../types';
import { ClassCollectorVisitor } from './visitor/class-collector-visitor';

export function getAuditOutput(
  audit: Pick<Audit, 'slug'>,
  components: ResolvedComponent[],
  componentReplacement: ComponentReplacement
): AuditOutput {
  const { componentName, matchingCssClasses } = componentReplacement;

  const allIssues: Issue[] = components.flatMap((comp) => {
    const { template, templateUrl, filePath } = comp;

    return matchingCssClasses.flatMap((cssClass) => {
      const visitor = new ClassCollectorVisitor(cssClass);
      visitor.visitAll(
        template ? template.ast.nodes : templateUrl ? templateUrl.ast.nodes : []
      );

      return mapTmplAstElementsToIssues(
        comp,
        visitor.getMatchingElements(),
        // if a templateUrl is given the filePath has to change
        templateUrl
          ? path.join(path.dirname(filePath), templateUrl.value)
          : filePath,
        componentName
      );
    });
  });

  return {
    ...audit,
    displayValue: `${allIssues.length} class${
      allIssues.length !== 1 ? 's' : ''
    } found`,
    score: allIssues.length === 0 ? 1 : 0,
    value: allIssues.length,
    details: {
      issues: allIssues,
    },
  };
}

/**
 *  Converts matching `TmplAstElement's` from a visitor into Issues.
 * @param comp Component that contains the matching elements. Used to get the template start line in order to calculate the real line of the issue.
 * @param matchingElements Elements that match the target class.
 * @param filePath File path of the component.
 * @param targetClass Target class that is being searched for.
 * @returns Array of Issues.
 */
export function mapTmplAstElementsToIssues(
  comp: ResolvedComponent,
  matchingElements: TmplAstElement[],
  filePath: string,
  targetClass: string
): Issue[] {
  return matchingElements.map((element) => ({
    message: `Element \`<${element.name}>\` contains the targeted class '${targetClass}'.`,
    severity: 'warning',
    source: {
      file: filePath,
      position: {
        startLine:
          element.sourceSpan.start.line + (comp.template?.startLine || 0) + 1, // +1 because the line number in the report is 1-indexed
      },
    },
  }));
}
