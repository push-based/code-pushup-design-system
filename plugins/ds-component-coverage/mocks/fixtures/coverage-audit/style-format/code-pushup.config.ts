import { ComponentReplacement } from '../../../../src/index';
import { angularDsCoveragePluginCoreConfig } from '../../../../src/core.config';

const dsComponents: ComponentReplacement[] = [
  {
    componentName: 'DSButton',
    matchingCssClasses: ['btn', 'btn-primary', 'legacy-button'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-button--overview',
  },
];
export default {
  persist: {
    outputDir: '.code-pushup/angular-ds/coverage-audit/style-format',
    format: ['json', 'md'],
  },
  ...(await angularDsCoveragePluginCoreConfig({
    directory: 'plugins/ds-component-coverage/mocks/fixtures/coverage-audit/style-format',
    dsComponents,
  })),
};
