import { PluginConfig } from '@code-pushup/models';
import { CreateRunnerConfig, runnerFunction } from './runner/create-runner';
import { getAudits } from './utils';
import { ANGULAR_DS_COVERAGE_PLUGIN_SLUG } from './constants';

export type DsComponentCoveragePluginConfig = CreateRunnerConfig;

/**
 * Plugin to measure and assert usage of DesignSystem components in an Angular project.
 * It will check if the there are class names in the project that should get replaced by a DesignSystem components.
 *
 * @param options
 */
export function dsComponentCoveragePlugin(
  options: DsComponentCoveragePluginConfig
): PluginConfig {
  return {
    slug: ANGULAR_DS_COVERAGE_PLUGIN_SLUG,
    title: 'Angular Design System Coverage',
    icon: 'angular',
    description:
      'A plugin to measure and assert usage of styles in an Angular project.',
    audits: getAudits(options.dsComponents),
    runner: () => runnerFunction(options),
  } as const;
}

export default dsComponentCoveragePlugin;
