import { angularDsCoveragePluginCoreConfig } from '../../../src/core.config';

export default {
  persist: {
    outputDir: '.code-pushup/angular-ds-coverage-style-formats-demo',
    format: ['json', 'md'],
  },
  ...(await angularDsCoveragePluginCoreConfig({
    directory: 'libs/design-system',
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
