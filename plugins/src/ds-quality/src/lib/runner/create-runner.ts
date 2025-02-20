import { AuditOutputs } from '@code-pushup/models';
import {
  findComponents,
  parseComponents,
  ParsedComponent,
  visitComponentStyles,
} from '../../../../utils/src';
import {
  getStyleMixinAuditOutput,
  getStyleVariableAuditOutput,
} from './audits/variable-usage/variable-usage.audit';
import { DeprecationDefinition } from './audits/types';
import { getMixinUsageIssues } from './audits/mixin-usage/utils';
import { getVariableUsageIssues } from './audits/variable-usage/utils';

export type CreateRunnerConfig = {
  directory: string;
  deprecatedTokens?: DeprecationDefinition[];
  deprecatedMixins?: DeprecationDefinition[];
};

/**
 * Runner function for the Angular Design System Coverage plugin. It will parse all the components in the directory and resolve the styles and templates.
 * @param options Plugin configuration. Directory and DesignSystem components.
 */
export async function runnerFunction({
  directory,
  deprecatedTokens = [],
  deprecatedMixins = [],
}: CreateRunnerConfig): Promise<AuditOutputs> {
  const parsedComponents: ParsedComponent[] = parseComponents(
    await findComponents({ directory })
  );

  const auditResults: AuditOutputs[] = await Promise.all(
    parsedComponents.map(async (parsedComponent) => {
      const tokenAuditPromises = deprecatedTokens.map(
        async (deprecatedToken) => {
          const issues = await visitComponentStyles(
            parsedComponent,
            deprecatedToken,
            getVariableUsageIssues
          );
          return getStyleVariableAuditOutput(deprecatedToken, issues);
        }
      );

      const mixinAuditPromises = deprecatedMixins.map(
        async (deprecatedMixin) => {
          const issues = await visitComponentStyles(
            parsedComponent,
            deprecatedMixin,
            getMixinUsageIssues
          );
          return getStyleMixinAuditOutput(deprecatedMixin, issues);
        }
      );

      const [tokenAudits, mixinAudits] = await Promise.all([
        Promise.all(tokenAuditPromises),
        Promise.all(mixinAuditPromises),
      ]);

      return [...tokenAudits.flat(), ...mixinAudits.flat()];
    })
  );

  return auditResults.flat();
}
