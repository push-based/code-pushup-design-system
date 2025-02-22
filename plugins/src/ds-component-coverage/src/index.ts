import { dsComponentCoveragePlugin } from './lib/ds-component-coverage.plugin';
export {
  dsComponentCoveragePlugin,
  DsComponentUsagePluginConfig,
} from './lib/ds-component-coverage.plugin';
export { getAngularDsUsageCategoryRefs } from './lib/utils';
export { ANGULAR_DS_USAGE_PLUGIN_SLUG } from './lib/constants';

export default dsComponentCoveragePlugin;
export { ComponentReplacement } from './lib/runner/audits/ds-coverage/types';
