import { ResolvedComponent } from './types';

import { Audit, AuditOutput, Issue } from '@code-pushup/models';
import { ComponentReplacement } from '../types';
import { ClassCollectorVisitor } from './visitor/class-collector-visitor';
import { TmplAstElement } from '@angular/compiler';
import path from 'node:path';

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
        //template ? template.ast.nodes : templateUrl ? templateUrl.ast.nodes : []
        template ? template.ast.nodes : templateUrl ? templateUrl.ast.nodes : []
      );

      return mapTmplAstElementsToIssues(
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
 * Converts matching `TmplAstElement's` from a visitor into Issues.
 */
export function mapTmplAstElementsToIssues(
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
        startLine: element.sourceSpan.start.line,
      },
    },
  }));
}
