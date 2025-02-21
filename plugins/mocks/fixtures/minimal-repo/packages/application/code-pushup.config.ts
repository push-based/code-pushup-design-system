import { mergeConfigs } from '@code-pushup/utils';
import { dsComponentCoveragePluginCoreConfig } from '@frontend/design-system-reports';

export default mergeConfigs(
  {
    persist: {
      outputDir: '.code-pushup/packages/application',
      format: ['json', 'md'],
    },
    plugins: [],
  },
  await dsComponentCoveragePluginCoreConfig({
    directory: 'plugins/mocks/fixtures/minimal-repo/packages/application',
    dsComponents: [
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
        deprecatedCssClasses: [
          'dropdown',
          'legacy-dropdown',
          'custom-dropdown',
        ],
        docsUrl:
          'https://storybook.entaingroup.corp/latest/?path=/docs/components-dropdown--overview',
      },
      {
        componentName: 'DSAlert',
        deprecatedCssClasses: ['alert', 'alert-warning'],
        docsUrl:
          'https://storybook.entaingroup.corp/latest/?path=/docs/components-alert--overview',
      },
      {
        componentName: 'DSAlertTooltip',
        deprecatedCssClasses: ['alert', 'alert-tooltip'],
        docsUrl:
          'https://storybook.entaingroup.corp/latest/?path=/docs/components-alert-tooltip--overview',
      },
      {
        componentName: 'DSDropDownButton',
        deprecatedCssClasses: ['btn', 'btn-dropdown'],
        docsUrl:
          'https://storybook.entaingroup.corp/latest/?path=/docs/components-btn-dropdown--overview',
      },
      {
        componentName: 'DSProgressBar',
        deprecatedCssClasses: [
          'progress-bar',
          'loading-bar',
          'legacy-progress',
        ],
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
    ],
  })
);
