import { Issue } from '@code-pushup/models';

export interface DiagnosticsAware {
  // @TODO use Set<Issue>
  getIssues(): Issue[];
  clear(): void;
}
