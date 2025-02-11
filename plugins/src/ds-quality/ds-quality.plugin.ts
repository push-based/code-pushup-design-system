import { CategoryConfig, CoreConfig, PluginConfig } from '@code-pushup/models';
import { TokenReplacement } from './src/lib/runner/audits/style-tokens/types';
import {
  getStyleTokenAudits,
  getStyleTokenCategoryRefs,
} from './src/lib/runner/audits/style-tokens/utils';
import { runnerFunction } from './src/lib/runner/create-runner';
import { loadDeprecatedTokens } from './tools/utils';

export type DsQualityPluginConfig = QualityRunnerOptions;

export type QualityRunnerOptions = {
  directory: string;
  tokenPath?: string;
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

export async function dsQualityPluginCoreConfig(opt: DsQualityPluginConfig) {
  return {
    plugins: [
      dsQualityPlugin(opt),
    ],
    categories: await dsQualityPluginCategories(opt),
  } as const satisfies CoreConfig;
}

export async function dsQualityPluginCategories({
  deprecatedTokens, tokenPath
}: Pick<DsQualityPluginConfig, 'deprecatedTokens' | 'tokenPath'>): Promise<CategoryConfig[]> {
  const tokens = tokenPath ? await loadDeprecatedTokens(tokenPath) : [];
  return [
    {
      slug: 'design-system-quality',
      title: 'Design System Quality',
      description: 'Usage of design system components',
      refs: getStyleTokenCategoryRefs([...deprecatedTokens, ...tokens]),
    },
  ];
}

export default dsQualityPlugin;
