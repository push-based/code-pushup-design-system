import { Audit } from '@code-pushup/models';
import { slugify } from '@code-pushup/utils';
import { DeprecationDefinition } from '../types';

export function getStyleTokenAuditSlug(deprecatedToken: string): string {
  return slugify(`deprecated-token-${deprecatedToken}`);
}

export function getStyleTokenAuditTitle(deprecatedToken: string): string {
  return `Deprecated token ${deprecatedToken} used`;
}

export function getStyleTokenAuditDescription(deprecatedToken: string): string {
  return `Deprecated token ${deprecatedToken} used in the component styles.`;
}

export function getStyleTokenAudits(
  deprecatedCssVars: DeprecationDefinition[]
): Audit[] {
  return deprecatedCssVars.map(({ deprecatedEntity }) => ({
    slug: getStyleTokenAuditSlug(deprecatedEntity),
    title: getStyleTokenAuditTitle(deprecatedEntity),
    description: getStyleTokenAuditDescription(deprecatedEntity),
  }));
}
