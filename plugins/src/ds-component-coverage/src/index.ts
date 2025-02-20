import { dsComponentCoveragePlugin } from './lib/ds-component-coverage.plugin';
export {
  dsComponentCoveragePlugin,
  DsComponentCoveragePluginConfig,
} from './lib/ds-component-coverage.plugin';
export { getAngularDsCoverageCategoryRefs } from './lib/utils';
export { ANGULAR_DS_COVERAGE_PLUGIN_SLUG } from './lib/constants';

export default dsComponentCoveragePlugin;
export { ComponentReplacement } from './lib/runner/audits/ds-coverage/types';
