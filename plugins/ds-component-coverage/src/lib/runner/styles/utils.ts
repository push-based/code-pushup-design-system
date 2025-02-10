import { Issue } from '@code-pushup/models';
import { type Root, Rule } from 'postcss';
import { Asset, ParsedComponent } from '../utils/types';

/**
 * Convert a Root to an Issue source object and adjust its position based on startLine.
 * It creates a "linkable" source object for the issue.
 * By default, the source location is 0 indexed, so we add 1 to the startLine to make it work in file links.
 *
 * @param rule The AST rule to convert into a linkable source object.
 * @param startLine The positions of the asset contain the style rules.
 */
export function styleAstRuleToSource(
  { source }: Pick<Rule, 'source'>,
  startLine = 0 // 0 indexed
): Issue['source'] {
  if (source?.input.file == null) {
    throw new Error(
      'style parsing was not initialized with a file path. Check the postcss options.'
    );
  }
  const offset = startLine - 1; // -1 because PostCss is 1 indexed so we have to substract 1 to make is work in 0 based index

  return {
    file: source.input.file,
    position: {
      startLine: (source?.start?.line ?? 1) + offset + 1, // +1 because the code works 0 indexed and file links work 1 indexed.
      ...(source?.start?.column && { startColumn: source?.start?.column }),
      ...(source?.end?.line && { endLine: source?.end?.line + offset + 1 }), // +1 because the code works 0 indexed and file links work 1 indexed.
      ...(source?.end?.column && { endColumn: source?.end?.column }),
    },
  };
}

export function getMatchingClassNames(
  { selector }: Pick<Rule, 'selector'>,
  targetClassNames: string[]
): string[] {
  const classNames = selector.match(/\.[\w-]+/g) || [];
  return classNames
    .map((className) => className.slice(1)) // Strip the leading "."
    .filter((className) => targetClassNames.includes(className));
}

export async function visitComponentStyles<T>(
  component: ParsedComponent,
  getIssues: (asset: Asset<Root>, comp: ParsedComponent) => Promise<Issue[]>
): Promise<Issue[]> {
  const { styles, styleUrls } = component;

  // Handle inline styles
  return (
    await Promise.all(
      [...styles, ...styleUrls].flatMap(async (style: Asset<Root>) => {
        return getIssues(style, component);
      })
    )
  ).flat();
}
