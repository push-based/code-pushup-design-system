import { Audit, Issue } from '@code-pushup/models';
import { slugify } from '@code-pushup/utils';
import { DeprecationDefinition } from '../types';
import { Asset } from '../../../../../../utils/src';
import type { Root } from 'postcss';
import { createCssMixinUsageVisitor } from './mixin-usage.visitor';
import { createCssMixinImportVisitor } from './mixin-import.visitor';
import { visitEachStyleNode } from '../../../../../../utils/src/lib/styles/stylesheet.walk';

export function getMixinUsageAuditSlug(deprecatedEntity: string): string {
  return slugify(`deprecated-mixin-${slugify(deprecatedEntity.replace('.', '-'))}`);
}

export function getDeprecatedMixinAudits(
  deprecatedMixins: DeprecationDefinition[]
): Audit[] {
  return deprecatedMixins.map(({ deprecatedEntity }) => ({
    slug: getMixinUsageAuditSlug(deprecatedEntity),
    title: `Deprecated mixin ${deprecatedEntity} used`,
    description: `Deprecated mixin ${deprecatedEntity} used in the component styles.`,
  }));
}

export async function getMixinUsageIssues(
  replacement: DeprecationDefinition,
  asset: Asset<Root>
): Promise<Issue[]> {
  const mixinUsageVisitor = createCssMixinUsageVisitor(
    replacement,
    asset.startLine
  );
  const mixinImportVisitor = createCssMixinImportVisitor(
    replacement,
    asset.startLine
  );

  const ast = (await asset.parse()).root as unknown as Root;
  visitEachStyleNode(ast.nodes, mixinUsageVisitor);
  visitEachStyleNode(ast.nodes, mixinImportVisitor);

  return [...mixinUsageVisitor.getIssues(), ...mixinImportVisitor.getIssues()];
}
