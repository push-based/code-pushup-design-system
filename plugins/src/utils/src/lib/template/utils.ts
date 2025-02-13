import {
  ParsedTemplate,
  TmplAstElement,
  TmplAstTemplate,
  TmplAstTextAttribute,
} from '@angular/compiler';
import { Issue } from '@code-pushup/models';
import { Asset, ParsedComponent } from '../utils/types';
import type { Root } from 'postcss';
import { ComponentReplacement } from '../../../../ds-component-coverage/src';
import { ClassUsageVisitor } from '../../../../ds-component-coverage/src/lib/runner/audits/ds-coverage/class-usage.visitor';
import { visitEachTmplChild } from './template.walk';
import { TokenReplacementDefinition } from '../../../../ds-quality/src/lib/runner/audits/style-tokens/types';

/**
 * Convert a TmplAstElement to an Issue source object and adjust its position based on startLine.
 * It creates a "linkable" source object for the issue.
 * By default, the source location is 0 indexed, so we add 1 to the startLine to make it work in file links.
 *
 * @param element The element to convert.
 * @param startLine The base line number to adjust positions.
 */
export function tmplAstElementToSource(
  { startSourceSpan, sourceSpan, endSourceSpan }: TmplAstElement,
  startLine = 0
): Issue['source'] {
  const offset = startLine; // TS Ast is 0 indexed so is work in 0 based index out of the box
  return {
    file: sourceSpan.start.file.url,
    position: {
      startLine: (startSourceSpan?.start.line ?? 0) + offset + 1,
      ...(startSourceSpan?.start.col && {
        startColumn: startSourceSpan?.start.col,
      }),
      ...(endSourceSpan?.end.line !== undefined && {
        endLine: endSourceSpan?.end.line + offset + 1,
      }),
      ...(endSourceSpan?.end.col && {
        endColumn: endSourceSpan?.end.col,
      }),
    },
  };
}

export function parseClassNames(classString: string): string[] {
  return classString.trim().split(/\s+/).filter(Boolean);
}

export async function visitComponentTemplate<T>(
  component: ParsedComponent,
  visitorArgument: T,
  getIssues: (
    tokenReplacement: T,
    asset: Asset<ParsedTemplate>
  ) => Promise<Issue[]>
): Promise<Issue[]> {
  const { templateUrl, template } = component;

  if (templateUrl == null && template == null) {
    return [];
  }
  const componentTemplate = templateUrl ?? template;

  return getIssues(visitorArgument, componentTemplate);
}
