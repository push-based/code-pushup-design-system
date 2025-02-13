import { angularDsCoveragePluginCoreConfig } from '../../../src/ds-component-coverage/src/core.config';
import { mergeConfigs } from '@code-pushup/utils';

export default mergeConfigs(
  {
    persist: {
      outputDir: '.code-pushup/ds-plugins',
      format: ['json', 'md'],
    },
    plugins: [],
  },
  await angularDsCoveragePluginCoreConfig({
    directory: 'plugins/src/ds-component-coverage/mocks/fixtures/minimal-app',
    dsComponents: [
      {
        docsUrl:
          'https://storybook.entaingroup.corp/latest/?path=/docs/components-dropdown--overview',
        componentName: 'DSDropdown',
        matchingCssClasses: ['dropdown', 'legacy-dropdown', 'custom-dropdown'],
      },
      {
        docsUrl:
          'https://storybook.entaingroup.corp/latest/?path=/docs/components-button--overview',
        componentName: 'DSButton',
        matchingCssClasses: ['btn', 'btn-dark', 'btn-light'],
      },
    ],
  })
);
