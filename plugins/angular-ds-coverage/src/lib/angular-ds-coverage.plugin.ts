import { PluginConfig } from '@code-pushup/models';
import { CreateRunnerConfig, runnerFunction } from './runner/create-runner';
import { getAudits } from './utils';
import { ANGULAR_DS_COVERAGE_PLUGIN_SLUG } from './constants';

export type AngularDsCoveragePluginConfig = CreateRunnerConfig;

/**
 * Plugin to measure and assert usage of DesignSystem components in an Angular project.
 * It will check if the there are class names in the project that should get replaced by a DesignSystem components.
 *
 * @param options
 */
export function angularDsCoverage(
  options: AngularDsCoveragePluginConfig
): PluginConfig {
  return {
    slug: ANGULAR_DS_COVERAGE_PLUGIN_SLUG,
    title: 'Angular Design System Coverage',
    icon: 'angular',
    description:
      'A plugin to measure and assert usage of styles in a Angular project.',
    audits: getAudits(options.dsComponents),
    runner: () => runnerFunction(options),
  };
}

export default angularDsCoverage;
