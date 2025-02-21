import { ComponentReplacement } from '../../../../src/index';
import { dsComponentCoveragePluginCoreConfig } from '../../../../src/core.config';

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
    outputDir: '.code-pushup/ds-component-coverage/asset-location',
    format: ['json', 'md'],
  },
  ...(await dsComponentCoveragePluginCoreConfig({
    directory:
      './plugins/src/ds-component-coverage/mocks/fixtures/e2e/asset-location',
    dsComponents,
  })),
};
