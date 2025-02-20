import { PluginConfig } from '@code-pushup/models';
import { DeprecationDefinition } from './runner/audits/types';
import { getDeprecatedVariableAudits } from './runner/audits/style-variable/utils';
import { runnerFunction } from './runner/create-runner';
import { getDeprecatedMixinAudits } from './runner/audits/style-mixins/utils';

export type DsQualityPluginConfig = QualityRunnerOptions;

export type QualityRunnerOptions = {
  directory: string;
  deprecatedVariables: DeprecationDefinition[];
  deprecatedMixins: DeprecationDefinition[];
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
    audits: [
      ...getDeprecatedVariableAudits(options.deprecatedVariables),
      ...getDeprecatedMixinAudits(options.deprecatedMixins),
    ],
    runner: () => runnerFunction(options),
  } as const;
}

export default dsQualityPlugin;
