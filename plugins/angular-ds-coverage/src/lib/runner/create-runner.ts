import { AuditOutputs } from '@code-pushup/models';
import { slugify } from '@code-pushup/utils';
import { ComponentReplacement } from '../types';
import { findAndParseComponents } from './parse-component';
import { resolveComponentFiles } from './resolver/utils';
import {
  getAuditOutput,
  getClassDefinitionIssues,
  getClassUsageIssues,
} from './utils';

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
  // Once the components are parsed, we can resolve the styles and templates.
  const parsedComponents = findAndParseComponents({ directory });
  // The parsed components contains general information about the component and the styles and templates, if inline they contain the template and styles already, if not, the path to the template and styles.

  // For the components that have the styles and template in a different file, we need to resolve the styles and templates.
  const resolvedComponents = await Promise.all(
    parsedComponents.map(async (comp) => await resolveComponentFiles(comp))
  );

  // Once the components are resolved, we can get the audit output for each component.
  return dsComponents.flatMap((dsComponent) => {
    const { matchingCssClasses } = dsComponent;

    const allIssues = [
      ...getClassUsageIssues(resolvedComponents, matchingCssClasses),
      ...getClassDefinitionIssues(resolvedComponents, matchingCssClasses),
    ];

    return getAuditOutput(
      `coverage-${slugify(dsComponent.componentName)}`,
      allIssues
    );
  });
}
