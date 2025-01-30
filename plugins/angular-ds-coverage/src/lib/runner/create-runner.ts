import { AuditOutputs } from '@code-pushup/models';
import { findAndParseComponents } from './parse-component';
import { resolveComponentFiles } from './resolver/utils';
import { getAuditOutput } from './utils';
import { ComponentReplacement } from '../types';
import { slugify } from '@code-pushup/utils';

export type CreateRunnerConfig = {
  directory: string;
  dsComponents: ComponentReplacement[];
};

export async function runnerFunction({
  directory,
  dsComponents,
}: CreateRunnerConfig): Promise<AuditOutputs> {
  const parsedComponents = findAndParseComponents({ directory });

  const resolvedComponents = await Promise.all(
    parsedComponents.map(async (comp) => await resolveComponentFiles(comp))
  );

  return dsComponents.flatMap((dsComponent) => {
    return getAuditOutput(
      {
        slug: `coverage-${slugify(dsComponent.componentName)}`,
      },
      resolvedComponents,
      dsComponent
    );
  });
}
