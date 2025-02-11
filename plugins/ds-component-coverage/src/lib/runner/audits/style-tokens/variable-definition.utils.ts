import { Asset, ParsedComponent } from '../../utils/types';
import { createCssVarUsageVisitor } from './variable-definition.visitor';
import { TokenReplacement } from './types';
import { Issue } from '@code-pushup/models';
import type { Root } from 'postcss';
import { visitEachStyleNode } from '../../styles/stylesheet.walk';

export async function getTokenUsageIssues(
  component: ParsedComponent,
  tokenReplacement: TokenReplacement
) {
  const { styles, styleUrls } = component;

  if (styleUrls == null && styles == null) {
    return [];
  }

  // Handle inline styles
  const styleIssues: Issue[] = (
    await Promise.all(
      (styles ?? []).flatMap(async (style: Asset<Root>) => {
        const stylesVisitor = createCssVarUsageVisitor(
          tokenReplacement,
          style.startLine
        );
        const ast = (await style.parse()).root as unknown as Root;
        visitEachStyleNode(ast, stylesVisitor);

        return stylesVisitor.getIssues();
      })
    )
  ).flat();

  const styleUrlIssues: Issue[] = (
    await Promise.all(
      (styleUrls ?? []).flatMap(async (styleUrl: Asset<Root>) => {
        const stylesVisitor = createCssVarUsageVisitor(
          tokenReplacement,
          styleUrl.startLine
        );
        const ast = (await styleUrl.parse()).root as unknown as Root;
        visitEachStyleNode(ast, stylesVisitor);

        return stylesVisitor.getIssues();
      })
    )
  ).flat();

  return [...styleIssues, ...styleUrlIssues];
}
