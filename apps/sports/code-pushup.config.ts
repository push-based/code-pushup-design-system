import { cpDefaultConfig, mergeConfigs } from '@frontend/code-pushup-utils';

export default mergeConfigs(
  {
    persist: {
      outputDir: '.code-pushup/sports-web-app',
      format: ['json', 'md'],
    },
  },
  await cpDefaultConfig({ nxProjectName: 'sports-web-app' })
);
