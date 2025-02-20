import { AuditOutputs } from '@code-pushup/models';
import { findComponents, parseComponents } from '../../../../utils/src';
import { dsCompCoverageAuditOutputs } from './audits/ds-coverage/ds-coverage.audit';
import { ComponentReplacement } from './audits/ds-coverage/types';

export type CreateRunnerConfig = ComponentCoverageRunnerOptions;

export type ComponentCoverageRunnerOptions = {
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
  const parsedComponents = parseComponents(await findComponents({ directory }));
  return dsCompCoverageAuditOutputs(dsComponents, parsedComponents);
}
