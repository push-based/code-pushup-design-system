import { Issue } from '@code-pushup/models';
import { Rule } from 'postcss';

/**
 * Convert a Root to an Issue source object and adjust its position based on startLine.
 * @param rule The AST rule to convert.
 * @param startLine The base line number to adjust positions.
 */
export function styleAstRuleToSource(
  { source }: Rule,
  startLine = 0
): Issue['source'] {
  if (source?.input.file == null) {
    throw new Error(
      'style parsing was not initialized with a file path. Check the postcss options.'
    );
  }
  return {
    file: source.input.file,
    position: {
      startLine: (source?.start?.line ?? 0) + startLine,
      ...(source?.start?.column && { startColumn: source?.start?.column }),
      ...(source?.end?.line && { endLine: source?.end?.line + startLine }),
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
