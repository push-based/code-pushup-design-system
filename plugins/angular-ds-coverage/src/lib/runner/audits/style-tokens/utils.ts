import { Audit, AuditOutput, CategoryRef, Issue } from '@code-pushup/models';
import { pluralize, slugify } from '@code-pushup/utils';
import { TokenReplacement } from './types';
import { ANGULAR_DS_COVERAGE_PLUGIN_SLUG } from '../../../constants';

/**
 * Creates a scored audit output for the CompCoverageAudit.
 * @param tokenName
 * @param issues
 * @returns Audit output.
 */
export function getStyleTokenAuditOutput(
  tokenName: string,
  issues: Issue[]
): AuditOutput {
  return {
    slug: getStyleTokenAuditSlug(tokenName),
    displayValue: `${issues.length} ${pluralize('class', issues.length)} found`,
    score: issues.length === 0 ? 1 : 0,
    value: issues.length,
    details: {
      issues,
    },
  };
}

export function getStyleTokenAuditSlug(tokenName: string): string {
  return slugify(`token-${tokenName}`);
}

export function getStyleTokenAuditTitle(tokenName: string): string {
  return `Token usage for ${tokenName} token`;
}

export function getStyleTokenAuditDescription(tokenName: string): string {
  return `Token usage audit for ${tokenName} component.`;
}

export function getStyleTokenAudits(
  deprecatedCssVars: TokenReplacement[]
): Audit[] {
  return deprecatedCssVars.map(({ tokenName }) => ({
    slug: getStyleTokenAuditSlug(tokenName),
    title: getStyleTokenAuditTitle(tokenName),
    description: getStyleTokenAuditDescription(tokenName),
  }));
}

export function getStyleTokenCategoryRefs(
  tokenReplacements: TokenReplacement[]
): CategoryRef[] {
  return getStyleTokenAudits(tokenReplacements).map(({ slug }) => ({
    slug,
    plugin: ANGULAR_DS_COVERAGE_PLUGIN_SLUG,
    type: 'audit',
    weight: 1,
  }));
}
