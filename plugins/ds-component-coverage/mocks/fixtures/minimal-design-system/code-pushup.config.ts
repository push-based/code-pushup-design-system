import { TokenReplacement } from '../../../src/lib/runner/audits/style-tokens/types';
import { dsQualityPluginCoreConfig } from '../../../src/lib/ds-quality.plugin';

const deprecatedTokens: TokenReplacement[] = [
  {
    tokenName: 'semantic-color-ds-background',
    deprecatedTokens: ['semantic-color-ds-accordion-background-active', 'semantic-color-ds-accordion-background-inactive']
  },
];

export default {
  persist: {
    outputDir: '.code-pushup/angular-ds/token-usage/demo',
    format: ['json', 'md'],
  },
  ...(await dsQualityPluginCoreConfig({
    directory:
      'plugins/ds-component-coverage/mocks/fixtures/minimal-design-system',
    deprecatedTokens,
  }))
};
