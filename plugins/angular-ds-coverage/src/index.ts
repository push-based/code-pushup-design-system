import { angularDsCoverage } from './lib/angular-ds-coverage.plugin';
export {
  angularDsCoverage,
  AngularDsCoveragePluginConfig,
} from './lib/angular-ds-coverage.plugin';
export { getAngularDsCoverageCategoryRefs } from './lib/utils';
export { ANGULAR_DS_COVERAGE_PLUGIN_SLUG } from './lib/constants';

export default angularDsCoverage;
export { ComponentReplacement } from './lib/runner/audits/ds-coverage/types';
