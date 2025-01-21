import { dsAdoptionReportConfig } from '@design-system/usage-reports-utils';
import { mergeConfigs } from '@frontend/code-pushup-utils';

export default mergeConfigs(
  {
    persist: {
      outputDir: '.code-pushup/sports',
      format: ['json', 'md'],
    },
  },
  await dsAdoptionReportConfig({
    directory: 'apps/sports',
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
