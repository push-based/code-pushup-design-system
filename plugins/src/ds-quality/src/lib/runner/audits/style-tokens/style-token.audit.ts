import { getStyleTokenAuditSlug } from './utils';
import { AuditOutput, Issue } from '@code-pushup/models';
import { TokenReplacement } from './types';
import { pluralize } from '@code-pushup/utils';

export function getStyleTokenAuditOutput(
  { tokenName }: TokenReplacement,
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
