import { dsQualityPluginCoreConfig } from '../../../../../src';
import {
  readDeprecatedMixins,
  readDeprecatedVariables,
} from '../../../../../src';

export default {
  persist: {
    outputDir: '.code-pushup/packages/design-system',
    format: ['json', 'md'],
  },
  ...(await dsQualityPluginCoreConfig({
    directory: 'plugins/mocks/fixtures/minimal-repo/packages/design-system',
    deprecatedVariables: await readDeprecatedVariables(
      'plugins/mocks/fixtures/minimal-repo/packages/design-system/ui/generated/deprecated.txt'
    ),
    deprecatedMixins: await readDeprecatedMixins(
      'plugins/mocks/fixtures/minimal-repo/packages/design-system/ui/generated/deprecated-mixins.txt'
    ),
  })),
};
