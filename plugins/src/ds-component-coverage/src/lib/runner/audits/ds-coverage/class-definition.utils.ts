import { Issue } from '@code-pushup/models';
import { createClassDefinitionVisitor } from './class-definition.visitor';
import { Asset } from '../../../../../../utils/src';
import { type Root } from 'postcss';
import { ComponentReplacement } from './types';
import { visitEachStyleNode } from '../../../../../../utils/src/lib/styles/stylesheet.walk';

export async function getClassDefinitionIssues(
  componentReplacement: ComponentReplacement,
  style: Asset<Root>
): Promise<Issue[]> {
  const stylesVisitor = createClassDefinitionVisitor(
    componentReplacement,
    style.startLine
  );
  const ast = (await style.parse()).root as unknown as Root;
  visitEachStyleNode(ast.nodes, stylesVisitor);

  return stylesVisitor.getIssues();
}
