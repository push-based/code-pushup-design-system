import { TmplAstElement } from '@angular/compiler';
import { Issue } from '@code-pushup/models';
import { Source } from 'postcss';

export function tmplAstElementToIssue(
  element: TmplAstElement,
  targetClass: string
): Issue {
  return {
    message: `Element <code>${element.name}</code> has class <code>${targetClass}</code> applied.`,
    severity: 'info',
    source: {
      file: element.sourceSpan.start.file.url,
      position: {
        startLine: element.startSourceSpan?.start.offset,
        endLine: element.endSourceSpan?.end.offset,
      },
    },
  };
}

export function stylesAstElementToIssue(
  source: Source,
  className: string
): Issue {
  return {
    message: `Class <code>${className}</code> is defined in the stylesheet. Use the DS component instead.`,
    severity: 'info',
    source: {
      file: source?.input.file ?? '',
      position: {
        startLine: source?.start?.line ?? 0,
        endLine: source.end?.line ?? 0,
      },
    },
  };
}
