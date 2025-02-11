import { Issue } from '@code-pushup/models';
import { createClassDefinitionVisitor } from './class-definition.visitor';
import {
  Asset,
  ParsedComponent, visitEachChild,
  visitEachStyleNode
} from '../../../../../../utils/src';
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
        const stylesVisitor = createClassDefinitionVisitor(
          componentReplacement,
          style.startLine
        );
        const ast = (await style.parse()).root as unknown as Root;
        visitEachChild(ast, stylesVisitor);

        return stylesVisitor.getIssues();
      })
    )
  ).flat();

  const styleUrlIssues: Issue[] = (
    await Promise.all(
      (styleUrls ?? []).flatMap(async (styleUrl: Asset<Root>) => {
        const stylesVisitor = createClassDefinitionVisitor(
          componentReplacement,
          styleUrl.startLine
        );
        const ast = (await styleUrl.parse()).root as unknown as Root;
        visitEachChild(ast, stylesVisitor);

        return stylesVisitor.getIssues();
      })
    )
  ).flat();

  return [...styleIssues, ...styleUrlIssues];
}
