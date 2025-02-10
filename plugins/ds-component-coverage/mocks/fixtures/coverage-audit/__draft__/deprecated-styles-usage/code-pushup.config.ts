import { ComponentReplacement } from '../../../src/index';
import angularDsCoveragePlugin from '../../../src/lib/ds-component-coverage.plugin';

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
      directory: 'plugins/ds-component-coverage/mocks/fixtures/deprecated-styles-usage',
      dsComponents,
    }),
  ],
};
