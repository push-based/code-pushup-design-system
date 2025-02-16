import { AuditOutputs, Issue } from '@code-pushup/models';
import {
  Asset,
  findComponents,
  parseComponents,
  ParsedComponent,
  visitComponentStyles,
} from '../../../../utils/src';
import {
  getStyleMixinAuditOutput,
  getStyleTokenAuditOutput,
} from './audits/style-tokens/style-token.audit';
import { DeprecationDefinition } from './audits/types';
import type { Root } from 'postcss';
import { createCssVarUsageVisitor } from './audits/style-tokens/variable-definition.visitor';
import { createCssMixinUsageVisitor } from './audits/style-mixins/mixin-usage.visitor';
import { visitEachStyleNode } from '../../../../utils/src/lib/styles/stylesheet.walk';
import { createCssMixinImportVisitor } from './audits/style-mixins/mixin-import.visitor';

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
    findComponents({ directory })
  );

  const auditResults: AuditOutputs[] = await Promise.all(
    parsedComponents.map(async (parsedComponent) => {
      const tokenAuditPromises = deprecatedTokens.map(
        async (deprecatedToken) => {
          const issues = await visitComponentStyles(
            parsedComponent,
            deprecatedToken,
            getTokenIssues
          );
          return getStyleTokenAuditOutput(deprecatedToken, issues);
        }
      );

      const mixinAuditPromises = deprecatedMixins.map(
        async (deprecatedMixin) => {
          const issues = await visitComponentStyles(
            parsedComponent,
            deprecatedMixin,
            getMixinIssues
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

async function getTokenIssues(
  replacement: DeprecationDefinition,
  asset: Asset<Root>
): Promise<Issue[]> {
  const tokenVisitor = createCssVarUsageVisitor(replacement, asset.startLine);

  const ast = (await asset.parse()).root as unknown as Root;
  visitEachStyleNode(ast.nodes, tokenVisitor);

  return tokenVisitor.getIssues();
}

async function getMixinIssues(
  replacement: DeprecationDefinition,
  asset: Asset<Root>
): Promise<Issue[]> {
  const mixinUsageVisitor = createCssMixinUsageVisitor(
    replacement,
    asset.startLine
  );
  const mixinImportVisitor = createCssMixinImportVisitor(
    replacement,
    asset.startLine
  );

  const ast = (await asset.parse()).root as unknown as Root;
  visitEachStyleNode(ast.nodes, mixinUsageVisitor);
  visitEachStyleNode(ast.nodes, mixinImportVisitor);

  return [...mixinUsageVisitor.getIssues(), ...mixinImportVisitor.getIssues()];
}
