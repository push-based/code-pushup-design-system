import { ParsedComponent } from '../../utils/types';
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
  if (styleUrls == null && styles == null) {
    return [];
  }
  const tmplAstTemplate = await (styleUrls ?? styles)?.parse();

  visitEachTmplChild(tmplAstTemplate?.nodes, visitor);

  return visitor.getIssues();
}
