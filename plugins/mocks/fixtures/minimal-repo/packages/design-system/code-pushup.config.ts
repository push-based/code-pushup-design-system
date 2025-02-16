import {
  DeprecationDefinition,
  dsQualityPlugin,
  readLinesFromTextFile,
} from '../../../../../src/index';

const deprecatedMixins: DeprecationDefinition[] = [
  ...(
    await readLinesFromTextFile(
      'plugins/mocks/fixtures/minimal-repo/packages/design-system/ui/generated/deprecated-mixins.txt'
    )
  ).map((token) => ({ deprecatedEntity: token })),
];

export default {
  persist: {
    outputDir: '.code-pushup/ds/',
    format: ['json', 'md'],
  },
  plugins: [
    dsQualityPlugin({
      directory: 'plugins/mocks/fixtures/minimal-repo/packages/design-system',
      deprecatedMixins,
      deprecatedTokens: [],
    }),
  ],
};
