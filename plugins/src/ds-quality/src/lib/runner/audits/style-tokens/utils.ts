import { Audit, CategoryRef } from '@code-pushup/models';
import { slugify } from '@code-pushup/utils';
import { TokenReplacementDefinition } from './types';

const DS_QUALITY_PLUGIN_SLUG = 'ds-quality';

export function getStyleTokenAuditSlug(deprecatedToken: string): string {
  return slugify(`deprecated-token-${(deprecatedToken)}`);
}

export function getStyleTokenAuditTitle(deprecatedToken: string): string {
  return `Deprecated token ${deprecatedToken} used`;
}

export function getStyleTokenAuditDescription(deprecatedToken: string): string {
  return `Deprecated token ${deprecatedToken} used in the component styles.`;
}

export function getStyleTokenAudits(
  deprecatedCssVars: TokenReplacementDefinition[]
): Audit[] {
  return deprecatedCssVars.map(({ deprecatedToken }) => ({
    slug: getStyleTokenAuditSlug(deprecatedToken),
    title: getStyleTokenAuditTitle(deprecatedToken),
    description: getStyleTokenAuditDescription(deprecatedToken),
  }));
}

export function getStyleTokenCategoryRefs(
  tokenReplacements: TokenReplacementDefinition[]
): CategoryRef[] {
  return getStyleTokenAudits(tokenReplacements).map(({ slug }) => ({
    slug,
    plugin: DS_QUALITY_PLUGIN_SLUG,
    type: 'audit',
    weight: 1,
  }));
}
