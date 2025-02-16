import { AuditOutput, Issue } from '@code-pushup/models';
import { pluralize } from '@code-pushup/utils';
import { getStyleMixinAuditSlug } from './utils';
import { DeprecationDefinition } from '../types';

export function getStyleTokenAuditOutput(
  { deprecatedEntity }: DeprecationDefinition,
  issues: Issue[]
): AuditOutput {
  return {
    slug: getStyleMixinAuditSlug(deprecatedEntity),
    displayValue: `${issues.length} ${pluralize('class', issues.length)} found`,
    score: issues.length === 0 ? 1 : 0,
    value: issues.length,
    details: {
      issues,
    },
  };
}
