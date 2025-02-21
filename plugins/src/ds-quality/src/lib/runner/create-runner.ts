import { AuditOutputs } from '@code-pushup/models';
import {
  findComponents,
  parseComponents,
  ParsedComponent,
  visitComponentStyles,
} from '../../../../utils/src';
import { getVariableUsageAuditOutput } from './audits/variable-usage/variable-usage.audit';
import { DeprecationDefinition } from './audits/types';
import { getMixinUsageIssues } from './audits/mixin-usage/utils';
import { getVariableUsageIssues } from './audits/variable-usage/utils';
import { getMixinUsageAuditOutput } from './audits/mixin-usage/mixin-usage.audit';

export type CreateRunnerConfig = {
  directory: string;
  deprecatedVariables: DeprecationDefinition[];
  deprecatedMixins: DeprecationDefinition[];
};

/**
 * Runner function for the Angular Design System Coverage plugin. It will parse all the components in the directory and resolve the styles and templates.
 * @param options Plugin configuration. Directory and DesignSystem components.
 */
export async function runnerFunction({
  directory,
  deprecatedVariables,
  deprecatedMixins,
}: CreateRunnerConfig): Promise<AuditOutputs> {
  const parsedComponents: ParsedComponent[] = parseComponents(
    await findComponents({ directory })
  );

  const auditResults: AuditOutputs[] = await Promise.all(
    parsedComponents.map(async (parsedComponent) => {
      const variableUsageAuditPromises = deprecatedVariables.map(
        async (deprecatedToken) => {
          const issues = await visitComponentStyles(
            parsedComponent,
            deprecatedToken,
            getVariableUsageIssues
          );
          return getVariableUsageAuditOutput(deprecatedToken, issues);
        }
      );

      const mixinAuditPromises = deprecatedMixins.map(
        async (deprecatedMixin) => {
          const issues = await visitComponentStyles(
            parsedComponent,
            deprecatedMixin,
            getMixinUsageIssues
          );
          return getMixinUsageAuditOutput(deprecatedMixin, issues);
        }
      );

      const [variableUsageAudits, mixinUsageAudits] = await Promise.all([
        Promise.all(variableUsageAuditPromises),
        Promise.all(mixinAuditPromises),
      ]);

      return [...variableUsageAudits.flat(), ...mixinUsageAudits.flat()];
    })
  );

  return auditResults.flat();
}
