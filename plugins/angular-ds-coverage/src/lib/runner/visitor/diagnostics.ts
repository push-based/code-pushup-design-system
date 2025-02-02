import { Issue } from '@code-pushup/models';

export interface DiagnosticsAware {
  getIssue(): Issue[];
}
