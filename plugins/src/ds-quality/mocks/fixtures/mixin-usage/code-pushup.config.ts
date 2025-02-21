import dsQualityPlugin from '../../../src';

export default {
  persist: {
    outputDir: '.code-pushup/ds-quality/mixin-usage',
    format: ['json', 'md'],
  },
  plugins: [
    dsQualityPlugin({
      directory: 'plugins/src/ds-quality/mocks/fixtures/mixin-usage',
      deprecatedMixins: [
        {
          deprecatedEntity: 'single-mixin-alias.mixin-name',
        },
      ],
    }),
  ],
};
