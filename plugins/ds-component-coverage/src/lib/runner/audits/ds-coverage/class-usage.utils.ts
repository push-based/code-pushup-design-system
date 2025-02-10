import { ParsedComponent } from '../../utils/types';
import { ComponentReplacement } from './types';
import { ClassUsageVisitor } from './class-usage.visitor';
import { visitEachTmplChild } from '../../template/template.walk';

export async function getClassUsageIssues(
  component: ParsedComponent,
  compReplacement: ComponentReplacement
) {
  const { templateUrl, template } = component;

  const visitor = new ClassUsageVisitor(
    compReplacement,
    (templateUrl ?? template).startLine
  );
  if (templateUrl == null && template == null) {
    return [];
  }
  const tmplAstTemplate = await (templateUrl ?? template)?.parse();

  visitEachTmplChild(tmplAstTemplate?.nodes, visitor);

  return visitor.getIssues();
}
