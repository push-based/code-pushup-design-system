import { PluginConfig } from '@code-pushup/models';
import { TokenReplacementDefinition } from '../../src/lib/runner/audits/style-tokens/types';
import { getStyleTokenAudits } from '../../src/lib/runner/audits/style-tokens/utils';
import { runnerFunction } from '../../src/lib/runner/create-runner';

export type DsQualityPluginConfig = QualityRunnerOptions;

export type QualityRunnerOptions = {
  directory: string;
  deprecatedTokens: TokenReplacementDefinition[];
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

export default dsQualityPlugin;
