import { TmplAstElement } from '@angular/compiler';
import { Issue } from '@code-pushup/models';

/**
 * Convert a TmplAstElement to an Issue source object and adjust its position based on startLine.
 * @param element The element to convert.
 * @param startLine The base line number to adjust positions.
 */
export function tmplAstElementToSource(
  element: TmplAstElement,
  startLine = 0
): Issue['source'] {
  return {
    file: element.sourceSpan.start.file.url,
    position: {
      startLine: (element.startSourceSpan?.start.line ?? 0) + startLine,
      ...(element.startSourceSpan?.start.col && {
        startColumn: element.startSourceSpan?.start.col,
      }),
      ...(element.endSourceSpan?.end.line !== undefined && {
        endLine: (element.endSourceSpan?.end.line ?? 0) + startLine,
      }),
      ...(element.endSourceSpan?.end.col && {
        endColumn: element.endSourceSpan?.end.col,
      }),
    },
  };
}

export function parseClassNames(classString: string): string[] {
  return classString.trim().split(/\s+/).filter(Boolean);
}
