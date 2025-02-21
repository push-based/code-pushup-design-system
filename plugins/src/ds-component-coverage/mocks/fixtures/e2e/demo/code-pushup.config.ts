import { ComponentReplacement } from '../../../../src';
import { dsComponentCoveragePluginCoreConfig } from '../../../../src/core.config';

const dsComponents: ComponentReplacement[] = [
  {
    componentName: 'DSButton',
    deprecatedCssClasses: ['btn', 'btn-primary', 'legacy-button'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-button--overview',
  },
  {
    componentName: 'DSTabsModule',
    deprecatedCssClasses: ['ms-tab-bar', 'legacy-tabs', 'custom-tabs'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-tabsgroup--overview',
  },
  {
    componentName: 'DSCard',
    deprecatedCssClasses: ['card', 'legacy-card', 'custom-card'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-card--overview',
  },
  {
    componentName: 'DSModal',
    deprecatedCssClasses: ['modal', 'popup', 'legacy-dialog'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-modal--overview',
  },
  {
    componentName: 'DSInput',
    deprecatedCssClasses: ['input', 'form-control', 'legacy-input'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-input--overview',
  },
  {
    componentName: 'DSDropdown',
    deprecatedCssClasses: ['dropdown', 'legacy-dropdown', 'custom-dropdown'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-dropdown--overview',
  },
  {
    componentName: 'DSAccordion',
    deprecatedCssClasses: ['accordion', 'collapse-panel', 'legacy-accordion'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-accordion--overview',
  },
  {
    componentName: 'DSAlert',
    deprecatedCssClasses: ['alert', 'notification', 'legacy-alert'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-alert--overview',
  },
  {
    componentName: 'DSTooltip',
    deprecatedCssClasses: ['tooltip', 'legacy-tooltip', 'info-bubble'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-tooltip--overview',
  },
  {
    componentName: 'DSBreadcrumb',
    deprecatedCssClasses: ['breadcrumb', 'legacy-breadcrumb', 'nav-breadcrumb'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-breadcrumb--overview',
  },
  {
    componentName: 'DSProgressBar',
    deprecatedCssClasses: ['progress-bar', 'loading-bar', 'legacy-progress'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-progressbar--overview',
  },
  {
    componentName: 'DSSlider',
    deprecatedCssClasses: ['slider', 'range-slider', 'legacy-slider'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-slider--overview',
  },
  {
    componentName: 'DSNavbar',
    deprecatedCssClasses: ['navbar', 'navigation', 'legacy-navbar'],
    docsUrl: 'https://storybook.entaingroup.corp/latest/?p',
  },
];

export default {
  persist: {
    outputDir: '.code-pushup/ds-component-coverage/demo',
    format: ['json', 'md'],
  },
  ...(await dsComponentCoveragePluginCoreConfig({
    directory: 'plugins/src/ds-component-coverage/mocks/fixtures/e2e/demo',
    dsComponents,
  })),
};
