import { ComponentReplacement } from '../../../src/index';
import { angularDsCoveragePluginCoreConfig } from '../../../src/core.config';

const dsComponents: ComponentReplacement[] = [
  {
    componentName: 'DSTabsModule',
    matchingCssClasses: ['ms-tab-bar', 'legacy-tabs', 'custom-tabs'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-tabsgroup--overview',
  },
  {
    componentName: 'DSButton',
    matchingCssClasses: ['btn', 'btn-primary', 'legacy-button'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-button--overview',
  },
  {
    componentName: 'DSCard',
    matchingCssClasses: ['card', 'legacy-card', 'custom-card'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-card--overview',
  },
  {
    componentName: 'DSModal',
    matchingCssClasses: ['modal', 'popup', 'legacy-dialog'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-modal--overview',
  },
  {
    componentName: 'DSInput',
    matchingCssClasses: ['input', 'form-control', 'legacy-input'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-input--overview',
  },
  {
    componentName: 'DSDropdown',
    matchingCssClasses: ['dropdown', 'legacy-dropdown', 'custom-dropdown'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-dropdown--overview',
  },
  {
    componentName: 'DSAccordion',
    matchingCssClasses: ['accordion', 'collapse-panel', 'legacy-accordion'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-accordion--overview',
  },
  {
    componentName: 'DSAlert',
    matchingCssClasses: ['alert', 'notification', 'legacy-alert'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-alert--overview',
  },
  {
    componentName: 'DSTooltip',
    matchingCssClasses: ['tooltip', 'legacy-tooltip', 'info-bubble'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-tooltip--overview',
  },
  {
    componentName: 'DSBreadcrumb',
    matchingCssClasses: ['breadcrumb', 'legacy-breadcrumb', 'nav-breadcrumb'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-breadcrumb--overview',
  },
  {
    componentName: 'DSProgressBar',
    matchingCssClasses: ['progress-bar', 'loading-bar', 'legacy-progress'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-progressbar--overview',
  },
  {
    componentName: 'DSSlider',
    matchingCssClasses: ['slider', 'range-slider', 'legacy-slider'],
    docsUrl:
      'https://storybook.entaingroup.corp/latest/?path=/docs/components-slider--overview',
  },
  {
    componentName: 'DSNavbar',
    matchingCssClasses: ['navbar', 'navigation', 'legacy-navbar'],
    docsUrl: 'https://storybook.entaingroup.corp/latest/?p',
  },
];

export default {
  persist: {
    outputDir: '.code-pushup/angular-ds-coverage-demo',
    format: ['json', 'md'],
  },
  ...(await angularDsCoveragePluginCoreConfig({
    directory: 'plugins/angular-ds-coverage/mocks/fixtures/ds-coverage-demo',
    dsComponents,
  })),
};
