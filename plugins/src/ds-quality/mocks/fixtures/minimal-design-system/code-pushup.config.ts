import { dsQualityPluginCoreConfig } from '../../../src/core.config';
import { DeprecationDefinition } from '../../../src/lib/runner/audits/types';
import {
  readDeprecatedMixins,
  readDeprecatedVariables,
  readLinesFromTextFile,
} from '../../../src/lib/utils';

export default {
  persist: {
    outputDir: '.code-pushup/angular-ds/ds-quality/minimal-design-system',
    format: ['json', 'md'],
  },
  ...(await dsQualityPluginCoreConfig({
    directory: 'plugins/src/ds-quality/mocks/fixtures/minimal-design-system',
    deprecatedVariables: await readDeprecatedVariables(
      'plugins/src/ds-quality/mocks/fixtures/minimal-design-system/ui/generated/deprecated.txt'
    ),
    deprecatedMixins: await readDeprecatedMixins(
      'plugins/src/ds-quality/mocks/fixtures/minimal-design-system/ui/generated/deprecated-mixins.txt'
    ),
  })),
};
