import { DeprecationDefinition } from '../../../src/lib/runner/audits/types';
import dsQualityPlugin from '../../../src/index';

const deprecatedTokens: DeprecationDefinition[] = [
  {
    deprecatedEntity: 'semantic-color-ds-deprecated-primary',
    replacement: 'primary-color'
  },
  {
    deprecatedEntity: 'semantic-color-ds-deprecated-primary',
    replacement: 'secondary-color'
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
      deprecatedTokens,
      deprecatedMixins: [],
    }),
  ],
};
