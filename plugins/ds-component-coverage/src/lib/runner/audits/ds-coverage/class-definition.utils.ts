import { Issue } from '@code-pushup/models';
import { createClassDefenitionVisitor } from './class-definition.visitor';
import { visitEachStyleNode } from '../../styles/stylesheet.walk';
import { Asset, ParsedComponent } from '../../utils/types';
import { type Root } from 'postcss';
import { ComponentReplacement } from './types';

export async function getClassDefinitionIssues(
  component: ParsedComponent,
  componentReplacement: ComponentReplacement
): Promise<Issue[]> {
  const { styles, styleUrls } = component;

  // Handle inline styles
  const styleIssues: Issue[] = (
    await Promise.all(
      (styles ?? []).flatMap(async (style: Asset<Root>) => {
        const stylesVisitor = createClassDefenitionVisitor(
          componentReplacement,
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
        const stylesVisitor = createClassDefenitionVisitor(
          componentReplacement,
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
