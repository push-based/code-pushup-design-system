import { AuditOutputs, Issue } from '@code-pushup/models';
import {
  Asset,
  findComponents,
  parseComponents,
  visitComponentStyles,
  visitEachChild,
} from '../../../../utils/src';
import { dsStyleTokenAuditOutputs } from './audits/style-tokens/style-token.audit';
import { TokenReplacement } from './audits/style-tokens/types';
import type { Root } from 'postcss';
import { createCssVarUsageVisitor } from './audits/style-tokens/variable-definition.visitor';

export type CreateRunnerConfig = {
  directory: string;
  tokenReplacements?: TokenReplacement[];
};

/**
 * Runner function for the Angular Design System Coverage plugin. It will parse all the components in the directory and resolve the styles and templates.
 * @param options Plugin configuration. Directory and DesignSystem components.
 */
export async function runnerFunction({
  directory,
  tokenReplacements,
}: CreateRunnerConfig): Promise<AuditOutputs> {
  const parsedComponents = parseComponents(findComponents({ directory }));

  async function getIssues(
    tokenReplacement: TokenReplacement,
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

  return Promise.all(
    parsedComponents.flatMap(async (parsedComponent) =>
      tokenReplacements.flatMap((tokenReplacement) => visitComponentStyles(parsedComponent, tokenReplacement, getIssues))
    ).flat(2)
  );
}
