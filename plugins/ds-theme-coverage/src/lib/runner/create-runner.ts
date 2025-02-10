import { AuditOutputs } from '@code-pushup/models';
import { findComponents } from './utils/find-component';
import { parseComponents } from './utils/parse-component';
import { ComponentReplacement } from '@code-pushup-design-system/ds-style-coverage';
import { dsCompCoverageAuditOutputs } from './audits/ds-coverage/ds-coverage.audit';
import { dsStyleTokenAuditOutputs } from './audits/style-tokens/style-token.audit';
import { TokenReplacement } from './audits/style-tokens/types';

export type CreateRunnerConfig = {
  directory: string;
  dsComponents: ComponentReplacement[];
  tokenReplacements?: TokenReplacement[];
};

/**
 * Runner function for the Angular Design System Coverage plugin. It will parse all the components in the directory and resolve the styles and templates.
 * @param options Plugin configuration. Directory and DesignSystem components.
 */
export async function runnerFunction({
  directory,
  dsComponents,
  tokenReplacements
}: CreateRunnerConfig): Promise<AuditOutputs> {
  const parsedComponents = parseComponents(findComponents({ directory }));

  return [
    ...(await dsCompCoverageAuditOutputs(dsComponents, parsedComponents)),
    ...(tokenReplacements ? await dsStyleTokenAuditOutputs(tokenReplacements, parsedComponents):[] ),
  ];
}
