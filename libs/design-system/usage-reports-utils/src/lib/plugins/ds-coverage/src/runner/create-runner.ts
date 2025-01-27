import { AuditOutputs } from '@code-pushup/models';
import { findAndParseComponents } from './parse-component';
import { resolveComponentFiles } from './resolver/utils';
import { DsCoveragePluginConfig } from '../ds.plugin';
import { getAuditOutput } from './utils';

export async function runnerFunction({
  directory,
  dsComponents,
}: DsCoveragePluginConfig): Promise<AuditOutputs> {
  const parsedComponents = findAndParseComponents({ directory });

  const resolvedComponents = await Promise.all(
    parsedComponents.map(async (comp) => await resolveComponentFiles(comp))
  );

  return dsComponents.flatMap((dsComponent) => {
    return getAuditOutput(resolvedComponents, dsComponent);
  });
}
