import { getCompCoverageAuditOutput } from './utils';
import { AuditOutputs } from '@code-pushup/models';
import {
  ParsedComponent,
  visitComponentStyles,
  visitComponentTemplate,
} from '../../../../../../utils/src';
import { ComponentReplacement } from './types';
import { getClassUsageIssues } from './class-usage.utils';
import { getClassDefinitionIssues } from './class-definition.utils';

export function dsCompCoverageAuditOutputs(
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
              ...(await visitComponentTemplate(
                component,
                dsComponent,
                getClassUsageIssues
              )),
              ...(await visitComponentStyles(
                component,
                dsComponent,
                getClassDefinitionIssues
              )),
            ];
          })
        )
      ).flat();

      return getCompCoverageAuditOutput(dsComponent, allIssues);
    })
  );
}
