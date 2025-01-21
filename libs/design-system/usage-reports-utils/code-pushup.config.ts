import { cpDefaultConfig, mergeConfigs } from '@frontend/code-pushup-utils';

export default mergeConfigs(
  {
    persist: {
      outputDir: '.code-pushup/usage-reports-utils',
      format: ['json', 'md'],
    },
  },
  await cpDefaultConfig({ nxProjectName: 'usage-reports-utils' })
);
