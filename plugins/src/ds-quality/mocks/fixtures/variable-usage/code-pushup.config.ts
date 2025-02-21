import { DeprecationDefinition } from '../../../src';
import dsQualityPlugin from '../../../src/index';

const deprecatedVariables: DeprecationDefinition[] = [
  {
    deprecatedEntity: 'semantic-color-ds-deprecated-primary'
  },
  {
    deprecatedEntity: 'semantic-color-ds-deprecated-secondary'
  },
  {
    deprecatedEntity: 'semantic-color-ds-deprecated-accent'
  }
];

export default {
  persist: {
    outputDir: '.code-pushup/angular-ds/ds-quality/variable-usage',
    format: ['json', 'md'],
  },
  plugins: [
    dsQualityPlugin({
      directory: 'plugins/src/ds-quality/mocks/fixtures/variable-usage',
      deprecatedVariables,
      deprecatedMixins: [],
    }),
  ],
};
