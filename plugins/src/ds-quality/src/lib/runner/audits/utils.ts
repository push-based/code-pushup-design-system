import { AuditOutput, Issue } from '@code-pushup/models';
import { IssueCodes } from './types';

export function scoreAuditOutput(
  issues: Issue[]
): Pick<AuditOutput, 'score' | 'value' | 'details'> {
  return {
    score: issues.length === 0 ? 1 : 0,
    value: issues.length,
    details: {
      issues,
    },
  };
}


export function filterIssuesByCode(issues: (Issue & {code?: number})[], code: IssueCodes): Issue[] {
  return issues
    .filter(issue => issue.code === code)
    .map(({ code, ...issue }) => issue);
}
