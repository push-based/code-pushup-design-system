import { ParsedComponent } from '../../utils/types';
import { ComponentReplacement } from '@code-pushup-design-system/angular-ds-coverage';
import { Issue } from '@code-pushup/models';
import { visitEachStyleNode } from '../../styles/stylesheet.walk';
import { createClassUsageStylesheetVisitor } from './class-definition.visitor';

export async function getClassDefinitionIssues(
  component: ParsedComponent,
  componentReplacement: ComponentReplacement
): Promise<Issue[]> {
  const { styles, styleUrls } = component;

  // Handle inline styles
  const styleIssues: Issue[] = (
    await Promise.all(
      (styles ?? []).flatMap(async (style) => {
        const stylesVisitor = createClassUsageStylesheetVisitor(
          componentReplacement,
          style.startLine
        );
        const ast = (await style.parse()).root;
        visitEachStyleNode(ast, stylesVisitor);

        return stylesVisitor.getIssues();
      })
    )
  ).flat();

  const styleUrlIssues: Issue[] = (
    await Promise.all(
      (styleUrls ?? []).flatMap(async (styleUrl) => {
        const stylesVisitor = createClassUsageStylesheetVisitor(
          componentReplacement,
          styleUrl.startLine
        );
        const ast = (await styleUrl.parse()).root;
        visitEachStyleNode(ast, stylesVisitor);

        return stylesVisitor.getIssues();
      })
    )
  ).flat();

  return [...styleIssues, ...styleUrlIssues];
}
