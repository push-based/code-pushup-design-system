import dsQualityPlugin from '../../../src';
import { DeprecationDefinition } from '../../../src/lib/runner/audits/types';
import { readLinesFromTextFile } from '../../../src/lib/utils';

const deprecatedMixins: DeprecationDefinition[] = [
  ...(
    await readLinesFromTextFile(
      'plugins/src/ds-quality/mocks/fixtures/mixin-usage/deprecated-mixins.txt'
    )
  ).map((token) => ({ deprecatedEntity: token })),
];

export default {
  persist: {
    outputDir: '.code-pushup/angular-ds/ds-quality/mixin-usage',
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
