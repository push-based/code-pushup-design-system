import { dsQualityPluginCoreConfig } from '../../../src/core.config';
import { DeprecationDefinition } from '../../../src/lib/runner/audits/types';
import { readLinesFromTextFile } from '../../../src/lib/utils';

const deprecatedTokens: DeprecationDefinition[] = [
  ...(
    await readLinesFromTextFile(
      'plugins/src/ds-quality/mocks/fixtures/minimal-design-system/ui/generated/deprecated.txt'
    )
  ).map((token) => ({ deprecatedEntity: token.replace('--', '') })),
  {
    deprecatedEntity: 'semantic-color-ds-deprecated-primary',
    replacement: 'secondary-color',
  },
  {
    deprecatedEntity: 'semantic-color-ds-deprecated-accent',
  },
];

const deprecatedMixins: DeprecationDefinition[] = [
  ...(
    await readLinesFromTextFile(
      'plugins/src/ds-quality/mocks/fixtures/minimal-design-system/ui/generated/deprecated-mixins.txt'
    )
  ).map((token) => ({ deprecatedEntity: token }))
];

export default {
  persist: {
    outputDir: '.code-pushup/angular-ds/ds-quality/minimal-design-system',
    format: ['json', 'md'],
  },
  ...(await dsQualityPluginCoreConfig({
    directory: 'plugins/src/ds-quality/mocks/fixtures/minimal-design-system',
    deprecatedVariables: deprecatedTokens,
    deprecatedMixins,
  }))
};
