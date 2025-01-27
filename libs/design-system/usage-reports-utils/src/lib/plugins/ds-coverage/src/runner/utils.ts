import { ResolvedComponent } from './types';

import { AuditOutput, Issue } from '@code-pushup/models';
import { mapTmplAstElementsToIssues } from './resolver/utils';
import { slugify } from '@code-pushup/utils';
import { ComponentReplacement } from '../types';
import { ClassCollectorVisitor } from './visitor/class-collector-visitor';

export function getAuditOutput(
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
        visitor.getMatchingElements(),
        filePath,
        componentName
      );
    });
  });

  return {
    slug: slugify(componentName),
    displayValue: `${allIssues.length} issue${
      allIssues.length !== 1 ? 's' : ''
    } found`,
    score: allIssues.length === 0 ? 1 : 0,
    value: allIssues.length,
    details: {
      issues: allIssues,
    },
  };
}
