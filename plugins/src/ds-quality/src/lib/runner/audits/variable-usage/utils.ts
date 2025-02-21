import { Audit, Issue } from '@code-pushup/models';
import { slugify } from '@code-pushup/utils';
import { DeprecationDefinition } from '../types';
import { Asset } from '../../../../../../utils/src';
import type { Root } from 'postcss';
import { createCssVarUsageVisitor } from './variable-usage.visitor';
import { visitEachStyleNode } from '../../../../../../utils/src/lib/styles/stylesheet.walk';

export function getStyleVariableAuditSlug(deprecatedToken: string): string {
  return slugify(`deprecated-token-${deprecatedToken.replace('.', '-')}`);
}

export function getStyleTokenAuditTitle(deprecatedToken: string): string {
  return `Deprecated token ${deprecatedToken} used`;
}

export function getStyleTokenAuditDescription(deprecatedToken: string): string {
  return `Deprecated token ${deprecatedToken} used in the component styles.`;
}

export function getDeprecatedVariableAudits(
  deprecatedCssVars: DeprecationDefinition[]
): Audit[] {
  return deprecatedCssVars.map(({ deprecatedEntity }) => ({
    slug: getStyleVariableAuditSlug(deprecatedEntity),
    title: getStyleTokenAuditTitle(deprecatedEntity),
    description: getStyleTokenAuditDescription(deprecatedEntity),
  }));
}

export async function getVariableUsageIssues(
  replacement: DeprecationDefinition,
  asset: Asset<Root>
): Promise<Issue[]> {
  const tokenVisitor = createCssVarUsageVisitor(replacement, asset.startLine);

  const ast = (await asset.parse()).root as unknown as Root;
  visitEachStyleNode(ast.nodes, tokenVisitor);

  return tokenVisitor.getIssues();
}
