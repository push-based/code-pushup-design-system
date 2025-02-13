import { TokenReplacementDefinition } from '../../../src/lib/runner/audits/style-tokens/types';
import dsQualityPlugin from '../../../src/index';

const deprecatedTokens: TokenReplacementDefinition[] = [
  {
    deprecatedToken: 'semantic-color-ds-deprecated-primary',
    tokenReplacement: 'primary-color'
  },
  {
    deprecatedToken: 'semantic-color-ds-deprecated-primary',
    tokenReplacement: 'secondary-color'
  },
  {
    deprecatedToken: 'semantic-color-ds-deprecated-accent'
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
    }),
  ],
};
