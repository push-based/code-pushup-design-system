import { AuditOutputs, Issue } from '@code-pushup/models';
import {
  Asset,
  findComponents,
  parseComponents,
  visitComponentStyles,
  visitEachChild,
} from '../../../../utils/src';
import { getStyleTokenAuditOutput } from './audits/style-tokens/style-token.audit';
import { TokenReplacementDefinition } from './audits/style-tokens/types';
import type { Root } from 'postcss';
import { createCssVarUsageVisitor } from './audits/style-tokens/variable-definition.visitor';

export type CreateRunnerConfig = {
  directory: string;
  deprecatedTokens?: TokenReplacementDefinition[];
};

/**
 * Runner function for the Angular Design System Coverage plugin. It will parse all the components in the directory and resolve the styles and templates.
 * @param options Plugin configuration. Directory and DesignSystem components.
 */
export async function runnerFunction({
  directory,
  deprecatedTokens,
}: CreateRunnerConfig): Promise<AuditOutputs> {
  const parsedComponents = parseComponents(findComponents({ directory }));
  return Promise.all(
    deprecatedTokens.map(async (deprecatedToken) => {
      const allIssues = (
        await Promise.all(
          parsedComponents.map((parsedComponent) =>
            visitComponentStyles(parsedComponent, deprecatedToken, getIssues)
          )
        )
      ).flat();

      return getStyleTokenAuditOutput(deprecatedToken, allIssues);
    })
  );
}

async function getIssues(
  tokenReplacement: TokenReplacementDefinition,
  asset: Asset<Root>
): Promise<Issue[]> {
  const stylesVisitor = createCssVarUsageVisitor(
    tokenReplacement,
    asset.startLine
  );
  const ast = (await asset.parse()).root as unknown as Root;
  visitEachChild(ast, stylesVisitor);

  return stylesVisitor.getIssues();
}
