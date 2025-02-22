import { ComponentReplacement } from '../../../../src/index';
import { dsComponentUsagePluginCoreConfig } from '../../../../src/core.config';

const dsComponents: ComponentReplacement[] = [
  {
    componentName: 'DSButton',
    deprecatedCssClasses: ['btn', 'btn-primary', 'legacy-button'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-button--overview',
  },
];

export default {
  persist: {
    outputDir: '.code-pushup/ds-component-coverage/line-number',
    format: ['json', 'md'],
  },
  ...(await dsComponentUsagePluginCoreConfig({
    directory: './plugins/src/ds-component-coverage/mocks/fixtures/e2e/line-number',
    dsComponents,
  })),
};
