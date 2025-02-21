import { AuditOutput, Issue } from '@code-pushup/models';
import { DeprecationDefinition } from '../types';
import { getStyleVariableAuditSlug } from './utils';
import { pluralize } from '@code-pushup/utils';
import { scoreAuditOutput } from '../utils';

export function getVariableUsageAuditOutput(
  { deprecatedEntity }: DeprecationDefinition,
  issues: Issue[]
): AuditOutput {
  return {
    slug: getStyleVariableAuditSlug(deprecatedEntity),
    displayValue: `${issues.length} ${pluralize('token', issues.length)} found`,
    ...scoreAuditOutput(issues),
  };
}
