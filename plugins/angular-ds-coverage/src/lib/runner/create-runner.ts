import { AuditOutputs } from '@code-pushup/models';
import { findComponents } from './utils/find-component';
import { parseComponents } from './utils/parse-component';
import { ComponentReplacement } from '@code-pushup-design-system/angular-ds-coverage';
import { dsCompCoverageAudits } from './audits/ds-coverage/ds-coverage.audit';

export type CreateRunnerConfig = {
  directory: string;
  dsComponents: ComponentReplacement[];
};

/**
 * Runner function for the Angular Design System Coverage plugin. It will parse all the components in the directory and resolve the styles and templates.
 * @param options Plugin configuration. Directory and DesignSystem components.
 */
export async function runnerFunction({
  directory,
  dsComponents,
}: CreateRunnerConfig): Promise<AuditOutputs> {
  const parsedComponents = parseComponents(findComponents({ directory }));

  return [...(await dsCompCoverageAudits(dsComponents, parsedComponents))];
}
