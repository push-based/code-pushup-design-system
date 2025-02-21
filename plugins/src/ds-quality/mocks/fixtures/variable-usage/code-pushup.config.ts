import dsQualityPlugin from '../../../src/index';

export default {
  persist: {
    outputDir: '.code-pushup/ds-quality/variable-usage',
    format: ['json', 'md'],
  },
  plugins: [
    dsQualityPlugin({
      directory: 'plugins/src/ds-quality/mocks/fixtures/variable-usage',
      deprecatedVariables: [
        {
          deprecatedEntity: 'semantic-color-ds-deprecated-primary',
        },
        {
          deprecatedEntity: 'semantic-color-ds-deprecated-secondary',
        },
        {
          deprecatedEntity: 'semantic-color-ds-deprecated-accent',
        },
      ],
    }),
  ],
};
