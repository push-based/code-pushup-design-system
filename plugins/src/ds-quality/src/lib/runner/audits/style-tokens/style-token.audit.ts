import { getStyleTokenAuditSlug } from './utils';
import { AuditOutput, Issue } from '@code-pushup/models';
import { DeprecationDefinition } from '../types';
import { pluralize } from '@code-pushup/utils';
import { getStyleMixinAuditSlug } from '../style-mixins/utils';

export function scoreAuditOutput(
  issues: Issue[]
): Pick<AuditOutput,'score' |'value' | 'details'> {
  return {
    score: issues.length === 0 ? 1 : 0,
    value: issues.length,
    details: {
      issues,
    },
  };
}

export function getStyleTokenAuditOutput(
  { deprecatedEntity }: DeprecationDefinition,
  issues: Issue[]
): AuditOutput {
  return {
    slug: getStyleTokenAuditSlug(deprecatedEntity),
    displayValue: `${issues.length} ${pluralize('token', issues.length)} found`,
    ...scoreAuditOutput(issues),
  };
}

export function getStyleMixinAuditOutput(
  { deprecatedEntity }: DeprecationDefinition,
  issues: Issue[]
): AuditOutput {
  return {
    slug: getStyleMixinAuditSlug(deprecatedEntity),
    displayValue: `${issues.length} ${pluralize('mixin', issues.length)} found`,
    ...scoreAuditOutput(issues),
  };
}
