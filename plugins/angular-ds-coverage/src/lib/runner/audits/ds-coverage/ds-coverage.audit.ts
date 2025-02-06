import { getClassUsageIssues } from './class-usage.visitor';
import { getClassDefinitionIssues } from './class-usage.utils';
import { getAuditOutput } from './utils';
import { AuditOutputs } from '@code-pushup/models';
import { ParsedComponent } from '../../utils/types';
import { ComponentReplacement } from './types';

export function dsCompCoverageAudits(
  dsComponents: ComponentReplacement[],
  parsedComponents: ParsedComponent[]
): Promise<AuditOutputs> {
  return Promise.all(
    dsComponents.map(async (dsComponent) => {
      const allIssues = (
        await Promise.all(
          parsedComponents.flatMap(async (component) => {
            return [
              // template checks
              ...(await getClassUsageIssues(component, dsComponent)),
              // style checks
              ...(await getClassDefinitionIssues(component, dsComponent)),
            ];
          })
        )
      ).flat();

      return getAuditOutput(dsComponent, allIssues);
    })
  );
}
