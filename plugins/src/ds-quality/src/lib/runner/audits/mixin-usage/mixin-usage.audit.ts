import { AuditOutput, Issue } from '@code-pushup/models';
import { pluralize } from '@code-pushup/utils';
import { getMixinUsageAuditSlug } from './utils';
import { DeprecationDefinition } from '../types';
import { scoreAuditOutput } from '../utils';

export function getMixinUsageAuditOutput(
  { deprecatedEntity }: DeprecationDefinition,
  issues: Issue[]
): AuditOutput {
  return {
    slug: getMixinUsageAuditSlug(deprecatedEntity),
    displayValue: `${issues.length} ${pluralize('mixin', issues.length)} found`,
    ...scoreAuditOutput(issues),
  };
}
