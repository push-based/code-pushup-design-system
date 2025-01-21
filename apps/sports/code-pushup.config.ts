import { cpDefaultConfig, mergeConfigs } from '@frontend/code-pushup-utils';

export default mergeConfigs(
  {
    persist: {
      outputDir: '.code-pushup/sports',
      format: ['json', 'md'],
    },
  },
  await cpDefaultConfig({ nxProjectName: 'sports' })
);
