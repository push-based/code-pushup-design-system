import { getStyleTokenAuditSlug } from './utils';
import { AuditOutput, AuditOutputs, Issue } from '@code-pushup/models';
import { ParsedComponent } from '../../../../../../utils/src';
import { TokenReplacement } from './types';
import { getTokenUsageIssues } from './variable-definition.utils';
import { pluralize } from '@code-pushup/utils';

export function dsStyleTokenAuditOutputs(
  tokenReplacements: TokenReplacement[],
  parsedComponents: ParsedComponent[]
): Promise<AuditOutputs> {
  return Promise.all(
    tokenReplacements.map(async (tokenReplacement) => {
      const allIssues = (
        await Promise.all(
          parsedComponents.flatMap(async (component) => {
            return [
              // token checks
              ...(await getTokenUsageIssues(component, tokenReplacement)),
            ];
          })
        )
      ).flat();


      return getStyleTokenAuditOutput(tokenReplacement, allIssues);
    })
  );
}

export function getStyleTokenAuditOutput(
  tokenReplacement: TokenReplacement,
  issues: Issue[]
): AuditOutput {
  return {
    slug: getStyleTokenAuditSlug(tokenReplacement.tokenName),
    displayValue: `${issues.length} ${pluralize('class', issues.length)} found`,
    score: issues.length === 0 ? 1 : 0,
    value: issues.length,
    details: {
      issues,
    },
  };
}
