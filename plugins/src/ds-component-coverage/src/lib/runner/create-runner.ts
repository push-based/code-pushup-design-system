import { AuditOutputs } from '@code-pushup/models';
import {
  ANGULAR_COMPONENT_DECORATOR,
  findFilesWithPattern,
  parseComponents,
} from '../../../../utils/src';
import { dsCompCoverageAuditOutputs } from './audits/ds-coverage/ds-coverage.audit';
import { ComponentReplacement } from './audits/ds-coverage/types';
import { SEARCH_EXCLUDED_DIRS } from '../../../../utils/src/lib/angular/constants';

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
  const componentFiles = await findFilesWithPattern(
    directory,
    ANGULAR_COMPONENT_DECORATOR,
    SEARCH_EXCLUDED_DIRS
  );
  const parsedComponents = parseComponents(componentFiles);
  return dsCompCoverageAuditOutputs(dsComponents, parsedComponents);
}
