import { angularDsCoverage } from './lib/ds-quality.plugin';
export {
  angularDsCoverage,
  AngularDsCoveragePluginConfig,
} from './lib/ds-quality.plugin';
export { getAngularDsCoverageCategoryRefs } from './lib/utils';
export { ANGULAR_DS_COVERAGE_PLUGIN_SLUG } from './lib/constants';

export default angularDsCoverage;
export { ComponentReplacement } from './lib/runner/audits/ds-coverage/types';
