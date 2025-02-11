import {
  AuditOutputs,
  CategoryConfig,
  CoreConfig,
  PluginConfig,
} from '@code-pushup/models';
import { parseComponents } from './runner/utils/parse-component';
import { findComponents } from './runner/utils/find-component';
import { dsStyleTokenAuditOutputs } from './runner/audits/style-tokens/style-token.audit';
import { TokenReplacement } from './runner/audits/style-tokens/types';
import {
  getStyleTokenAudits,
  getStyleTokenCategoryRefs,
} from './runner/audits/style-tokens/utils';

export type DsQualityPluginConfig = QualityRunnerOptions;

export type QualityRunnerOptions = {
  directory: string;
  deprecatedTokens: TokenReplacement[];
};

export const DS_QUALITY_PLUGIN_SLUG = 'ds-quality';


/**
 * Plugin to measure and assert usage of DesignSystem components in an Angular project.
 * It will check if the there are class names in the project that should get replaced by a DesignSystem components.
 *
 * @param options
 */
export function dsQualityPlugin(options: DsQualityPluginConfig): PluginConfig {
  return {
    slug: DS_QUALITY_PLUGIN_SLUG,
    title: 'Design System Quality',
    icon: 'angular',
    description:
      'A plugin to measure and assert the quality of the design system source code.',
    audits: getStyleTokenAudits(options.deprecatedTokens),
    runner: () => runnerFunction(options),
  } as const;
}

/**
 * Runner function for the Angular Design System Coverage plugin. It will parse all the components in the directory and resolve the styles and templates.
 * @param options Plugin configuration. Directory and DesignSystem components.
 */
export async function runnerFunction({
  directory,
  deprecatedTokens,
}: QualityRunnerOptions): Promise<AuditOutputs> {
  const parsedComponents = parseComponents(findComponents({ directory }));

  return [
    ...(await dsStyleTokenAuditOutputs(deprecatedTokens, parsedComponents)),
  ];
}

export async function dsQualityPluginCoreConfig({
  directory,
  deprecatedTokens,
}: DsQualityPluginConfig) {
  return {
    plugins: [
      dsQualityPlugin({
        directory,
        deprecatedTokens,
      }),
    ],
    categories: await dsQualityPluginCategories({ deprecatedTokens }),
  } as const satisfies CoreConfig;
}

export async function dsQualityPluginCategories({
  deprecatedTokens,
}: Pick<DsQualityPluginConfig, 'deprecatedTokens'>): Promise<CategoryConfig[]> {
  return [
    {
      slug: 'design-system-quality',
      title: 'Design System Quality',
      description: 'Usage of design system components',
      refs: getStyleTokenCategoryRefs(deprecatedTokens),
    },
  ];
}

export default dsQualityPlugin;
