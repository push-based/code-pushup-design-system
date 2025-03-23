import { mergeConfigs } from '@code-pushup/utils';
import { entainDsComponentUsageConfig } from '../../../../../src/config/entain-ds-components-usage.config';
import { ssrAdoptionPluginCoreConfig } from '../../../../../src/ssr-adoption/src/core.config';

export default mergeConfigs(
  {
    persist: {
      outputDir: '.code-pushup/packages/application',
      format: ['json', 'md'],
    },
    plugins: [],
  },
  await ssrAdoptionPluginCoreConfig({
    patterns: ['.'],
    eslintrc:
      'plugins/src/ssr-adoption/src/eslint.config.ssr.cjs',
  }),
  await entainDsComponentUsageConfig({
    directory: 'plugins/mocks/fixtures/minimal-repo/packages/application/src',
    dsComponents: [
      {
        componentName: 'DSButton',
        deprecatedCssClasses: ['btn', 'btn-primary', 'legacy-button'],
        docsUrl:
          'https://storybook.entaingroup.corp/latest/?path=/docs/components-button--overview',
      },
    ],
  })
);
