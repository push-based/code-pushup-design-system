import { TokenReplacementDefinition } from '../../../src/lib/runner/audits/style-tokens/types';
import { readDeprecatedCssVarsFromTextFile } from '../../../src/index';
import { dsQualityPluginCoreConfig } from '../../../src/core.config';

const deprecatedTokens: TokenReplacementDefinition[] = [
  ...(
    await readDeprecatedCssVarsFromTextFile(
      'plugins/src/ds-quality/mocks/fixtures/minimal-design-system/ui/generated/deprecated.txt'
    )
  ).map((token) => ({ deprecatedToken: token })),
  {
    deprecatedToken: 'semantic-color-ds-deprecated-primary',
    tokenReplacement: 'secondary-color',
  },
  {
    deprecatedToken: 'semantic-color-ds-deprecated-accent',
  },
];

export default {
  persist: {
    outputDir: '.code-pushup/angular-ds/ds-quality/minimal-design-system',
    format: ['json', 'md'],
  },
  ...(await dsQualityPluginCoreConfig({
    directory: 'plugins/src/ds-quality/mocks/fixtures/minimal-design-system',
    deprecatedTokens,
  }))
};
