import { angularDsCoveragePluginCoreConfig } from '../../../src/core.config';

export default {
  persist: {
    outputDir: '.code-pushup/ds-component-coverage-style-formats-demo',
    format: ['json', 'md'],
  },
  ...(await angularDsCoveragePluginCoreConfig({
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
  })),
};
