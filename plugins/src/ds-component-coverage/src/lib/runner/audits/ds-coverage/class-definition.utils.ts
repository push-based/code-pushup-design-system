import { Issue } from '@code-pushup/models';
import { createClassDefinitionVisitor } from './class-definition.visitor';
import { Asset, visitEachChild } from '../../../../../../utils/src';
import { type Root } from 'postcss';
import { ComponentReplacement } from './types';

export async function getClassDefinitionIssues(
  componentReplacement: ComponentReplacement,
  style: Asset<Root>
): Promise<Issue[]> {
  const stylesVisitor = createClassDefinitionVisitor(
    componentReplacement,
    style.startLine
  );
  const ast = (await style.parse()).root as unknown as Root;
  visitEachChild(ast, stylesVisitor);

  return stylesVisitor.getIssues();
}
