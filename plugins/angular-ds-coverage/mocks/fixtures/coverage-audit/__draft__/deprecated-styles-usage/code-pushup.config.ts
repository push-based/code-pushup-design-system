import { ComponentReplacement } from '../../../src/index';
import angularDsCoveragePlugin from '../../../src/lib/angular-ds-coverage.plugin';

const dsComponents: ComponentReplacement[] = [
  {
    componentName: 'DSTabsModule',
    matchingCssClasses: ['ms-tab-bar', 'legacy-tabs', 'custom-tabs'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-tabsgroup--overview',
  }
];

export default {
  persist: {
    outputDir: '.code-pushup/deprecated-styles-usage',
    format: ['json', 'md'],
  },
  plugins: [
    angularDsCoveragePlugin({
      directory: 'plugins/angular-ds-coverage/mocks/fixtures/deprecated-styles-usage',
      dsComponents,
    }),
  ],
};
