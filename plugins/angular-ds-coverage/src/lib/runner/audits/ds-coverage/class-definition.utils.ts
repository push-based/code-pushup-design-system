import { ParsedComponent } from '../../types';
import { ComponentReplacement } from '@code-pushup-design-system/angular-ds-coverage';
import { visitEachTmplChild } from '../../template/template.walk';
import { ClassUsageVisitor } from './class-usage.visitor';

export async function getClassUsageIssues(
  component: ParsedComponent,
  compReplacement: ComponentReplacement
) {
  const { templateUrl, template } = component;

  const visitor = new ClassUsageVisitor(
    compReplacement,
    templateUrl ?? template
  );
  if (templateUrl == null && template == null) {
    return [];
  }
  const tmplAstTemplate = await (templateUrl ?? template)?.parse();

  visitEachTmplChild(tmplAstTemplate?.nodes, visitor);

  return visitor.getIssues();
}
