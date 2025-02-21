import { dsQualityPlugin } from './lib/ds-quality.plugin';
export { type DeprecationDefinition } from './lib/runner/audits/types';

export { dsQualityPlugin } from './lib/ds-quality.plugin';
export {
  DS_QUALITY_PLUGIN_SLUG,
  type DsQualityPluginConfig,
  type QualityRunnerOptions,
} from './lib/ds-quality.plugin';

export default dsQualityPlugin;

export {
  readLinesFromTextFile,
  readDeprecatedVariables,
  readDeprecatedMixins,
} from './lib/utils';
