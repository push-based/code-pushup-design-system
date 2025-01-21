import { dsAdoptionReportConfig } from '@design-system/usage-reports-utils';
import { mergeConfigs } from '@frontend/code-pushup-utils';

export default mergeConfigs(
  {
    persist: {
      outputDir: '.code-pushup/sports-web-app',
      format: ['json', 'md'],
    },
  },
  await dsAdoptionReportConfig({
    directory: 'packages/sports/web/app',
    projectSlug: 'sports-ds-report',
    reportsTitle: 'Sports DS Report',
    replacements: [
      {
        componentName: 'DSTabsModule',
        matchingCssClasses: ['ms-tab-bar'],
        storybookLink:
          'https://storybook.entaingroup.corp/latest/?path=/docs/components-tabsgroup--overview',
      },
    ],
  })
);
