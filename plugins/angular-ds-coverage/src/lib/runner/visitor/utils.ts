import { TmplAstElement } from '@angular/compiler';
import { Issue } from '@code-pushup/models';
import { Rule } from 'postcss';

export function tmplAstElementToIssue(
  element: TmplAstElement,
  targetClass: string
): Issue {
  return {
    message: `Element <code>${element.name}</code> has class <code>${targetClass}</code> applied. Use the DS component instead.`,
    severity: 'info',
    source: {
      file: element.sourceSpan.start.file.url,
      position: {
        startLine: element.startSourceSpan?.start.line,
        endLine: element.endSourceSpan?.end.line,
        startColumn: element.startSourceSpan?.start.col,
        endColumn: element.endSourceSpan?.end.col,
      },
    },
  };
}

export function stylesAstRuleToIssue({ source, selector }: Rule, className: string): Issue {
  return {
    message: `Class <code>${className}</code> used in selector <code>${selector}</code> in the component styles. Use the DS component instead.`,
    severity: 'info',
    source: {
      file: source?.input.file ?? '',
      position: {
        startLine: source?.start?.line ?? 0,
        endLine: source?.end?.line ?? 0,
        startColumn: source?.start?.column ?? 0,
        endColumn: source?.end?.column ?? 0,
      },
    },
  };
}
