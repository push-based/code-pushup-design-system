import { AuditOutputs, Issue } from '@code-pushup/models';
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

  // Collect issues per deprecated token
  const variableIssuesMap = new Map<DeprecationDefinition, (Issue)[]>();
  const mixinIssuesMap = new Map<DeprecationDefinition, Issue[]>();

  await Promise.all(
    parsedComponents.map(async (parsedComponent) => {
      await Promise.all(
        deprecatedVariables.map(async (deprecatedToken) => {
          const tokenIssues = await visitComponentStyles(parsedComponent, deprecatedToken, getVariableUsageIssues);
          if (!variableIssuesMap.has(deprecatedToken)) {
            variableIssuesMap.set(deprecatedToken, []);
          }
          variableIssuesMap.get(deprecatedToken).push(...tokenIssues);
        })
      );
      await Promise.all(
        deprecatedMixins.map(async (deprecatedMixin) => {
          const mixinIssues = await visitComponentStyles(parsedComponent, deprecatedMixin, getMixinUsageIssues);
          if (!mixinIssuesMap.has(deprecatedMixin)) {
            mixinIssuesMap.set(deprecatedMixin, []);
          }
          mixinIssuesMap.get(deprecatedMixin).push(...mixinIssues);
        })
      );
    })
  );

  // Process issues per audit type
  const variableUsageAudits = Array.from(variableIssuesMap.entries()).map(
    ([deprecatedToken, issues]) => getVariableUsageAuditOutput(deprecatedToken, issues)
  );

  const mixinUsageAudits = Array.from(mixinIssuesMap.entries()).map(
    ([deprecatedMixin, issues]) => getMixinUsageAuditOutput(deprecatedMixin, issues)
  );

  return [...variableUsageAudits, ...mixinUsageAudits];
}
