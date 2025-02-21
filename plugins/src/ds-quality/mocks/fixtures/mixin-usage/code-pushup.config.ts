import dsQualityPlugin from '../../../src';
import { DeprecationDefinition } from '../../../src/lib/runner/audits/types';
import { readLinesFromTextFile } from '../../../src/lib/utils';

const deprecatedMixins: DeprecationDefinition[] = [
  {
    deprecatedEntity: 'single-mixin-alias.mixin-name'
  }
];

export default {
  persist: {
    outputDir: '.code-pushup/ds-quality/mixin-usage',
    format: ['json', 'md'],
  },
  plugins: [
    dsQualityPlugin({
      directory: 'plugins/src/ds-quality/mocks/fixtures/mixin-usage',
      deprecatedMixins,
      deprecatedVariables: [],
    }),
  ],
};
