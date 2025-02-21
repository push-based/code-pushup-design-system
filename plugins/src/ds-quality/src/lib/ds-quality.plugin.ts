import { PluginConfig } from '@code-pushup/models';
import { getDeprecatedVariableAudits } from './runner/audits/variable-usage/utils';
import { CreateRunnerConfig, runnerFunction } from './runner/create-runner';
import { getDeprecatedMixinAudits } from './runner/audits/mixin-usage/utils';
import { DS_QUALITY_PLUGIN_SLUG } from './constants';

export type DsQualityPluginConfig = Pick<CreateRunnerConfig, 'directory'> &
  Partial<Pick<CreateRunnerConfig, 'deprecatedVariables' | 'deprecatedMixins'>>;

/**
 * Plugin to measure and assert usage of DesignSystem components in an Angular project.
 * It will check if the there are class names in the project that should get replaced by a DesignSystem components.
 *
 * @param options
 */
export function dsQualityPlugin(options: DsQualityPluginConfig): PluginConfig {
  const {
    deprecatedVariables = [],
    deprecatedMixins = [],
    directory,
  } = options;
  return {
    slug: DS_QUALITY_PLUGIN_SLUG,
    title: 'Design System Quality',
    icon: 'angular',
    description:
      'A plugin to measure and assert the quality of the design system source code.',
    audits: [
      ...(deprecatedVariables.length
        ? getDeprecatedVariableAudits(deprecatedVariables)
        : []),
      ...(deprecatedMixins.length
        ? getDeprecatedMixinAudits(deprecatedMixins)
        : []),
    ],
    runner: () =>
      runnerFunction({ directory, deprecatedVariables, deprecatedMixins }),
  } as const;
}

export default dsQualityPlugin;
