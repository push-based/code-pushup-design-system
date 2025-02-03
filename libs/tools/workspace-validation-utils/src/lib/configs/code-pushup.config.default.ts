import eslintPlugin, { eslintConfigFromNxProject } from '@code-pushup/eslint-plugin';
import { CoreConfig } from '@code-pushup/models';

import { cpUploadConfig } from './upload';

export const cpDefaultConfig = async ({ nxProjectName, projectSlug }: { nxProjectName: string; projectSlug?: string }) =>
    ({
        plugins: [await eslintPlugin(await eslintConfigFromNxProject(nxProjectName))],
        categories: [
            {
                slug: 'bug-prevention',
                title: 'Bug prevention',
                refs: [{ type: 'group', plugin: 'eslint', slug: 'problems', weight: 1 }],
            },
            {
                slug: 'code-style',
                title: 'Code style',
                refs: [{ type: 'group', plugin: 'eslint', slug: 'suggestions', weight: 1 }],
            },
        ],
        ...cpUploadConfig(projectSlug || nxProjectName),
    }) satisfies CoreConfig;
