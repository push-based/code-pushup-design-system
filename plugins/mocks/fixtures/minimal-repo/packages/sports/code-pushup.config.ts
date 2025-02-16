import { mergeConfigs } from '@code-pushup/utils';
import { angularDsCoveragePluginCoreConfig } from '../../../../../src';

export default mergeConfigs(
  {
    persist: {
      outputDir: '.code-pushup/product/sports',
      format: ['json', 'md'],
    },
    plugins: [],
  },
  await angularDsCoveragePluginCoreConfig({
    directory: 'plugins/mocks/fixtures/minimal-repo/packages/sports/src',
    dsComponents: [
      {
        componentName: 'DSButton',
        matchingCssClasses: ['btn', 'btn-primary', 'legacy-button'],
        docsUrl:
          'https://storybook.entaingroup.corp/latest/?path=/docs/components-button--overview',
      },
      {
        componentName: 'DSTabsModule',
        matchingCssClasses: ['ms-tab-bar', 'legacy-tabs', 'custom-tabs'],
        docsUrl:
          'https://storybook.entaingroup.corp/latest/?path=/docs/components-tabsgroup--overview',
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
        componentName: 'DSAlert',
        matchingCssClasses: ['alert',  'alert-warning'],
        docsUrl:
          'https://storybook.entaingroup.corp/latest/?path=/docs/components-alert--overview',
      },
      {
        componentName: 'DSAlertTooltip',
        matchingCssClasses: ['alert',  'alert-tooltip'],
        docsUrl:
          'https://storybook.entaingroup.corp/latest/?path=/docs/components-alert-tooltip--overview',
      },
      {
        componentName: 'DSDropDownButton',
        matchingCssClasses: ['btn', 'btn-dropdown'],
        docsUrl:
          'https://storybook.entaingroup.corp/latest/?path=/docs/components-btn-dropdown--overview',
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
    ],
  })
);
