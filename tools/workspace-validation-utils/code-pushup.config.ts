import { cpDefaultConfig, mergeConfigs } from '@frontend/code-pushup-utils';

export default mergeConfigs(
    {
        persist: {
            outputDir: '.code-pushup/workspace-validation-utils',
            format: ['json', 'md'],
        },
    },
    await cpDefaultConfig({ nxProjectName: 'workspace-validation-utils' }),
);
