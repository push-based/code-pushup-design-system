import { ParsedComponent } from '../../utils/types';
import { ComponentReplacement } from '@code-pushup-design-system/angular-ds-coverage';
import { createCssVarUsageVisitor } from './variable-definition.visitor';
import { visitEachTmplChild } from '../../template/template.walk';
import { TokenReplacement } from './types';

export async function getTokenUsageIssues(
  component: ParsedComponent,
  tokenReplacement: TokenReplacement
) {
  const { styles, styleUrls } = component;

  const visitor = createCssVarUsageVisitor(
    tokenReplacement,
    (styleUrls ?? styles).startLine
  );
  if (templateUrl == null && template == null) {
    return [];
  }
  const tmplAstTemplate = await (templateUrl ?? template)?.parse();

  visitEachTmplChild(tmplAstTemplate?.nodes, visitor);

  return visitor.getIssues();
}
