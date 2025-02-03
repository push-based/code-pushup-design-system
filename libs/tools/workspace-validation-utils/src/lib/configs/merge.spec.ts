import { CoreConfig, PluginConfig } from '@code-pushup/models';
import { describe, expect, it } from 'vitest';

import { mergeConfigs } from './merge';

const MOCK_CONFIG_PERSIST = {
    persist: {
        outputDir: '.code-pushup/packages/casino/app',
        format: ['json', 'md'],
    },
} as CoreConfig;

const MOCK_CONFIG_NX_VALIDATORS: CoreConfig = {
    plugins: [{ slug: 'nx-validators-plugin' } as PluginConfig],
    categories: [
        {
            slug: 'nx-validators',
            title: 'Workspace Validation',
            refs: [],
        },
    ],
};

const MOCK_CONFIG_ESLINT: CoreConfig = {
    plugins: [{ slug: 'eslint-plugin' } as PluginConfig],
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
};

const MOCK_UPLOAD_CONFIG = {
    upload: {
        server: 'https://portal:80/graphql',
        apiKey: 'cp_apiKey',
        organization: 'entain',
        project: 'fe-monorepo',
    },
} as CoreConfig;

describe('mergeObjects', () => {
    it('should merge nx-validators plugin into empty config', () => {
        expect(mergeConfigs({} as CoreConfig, MOCK_CONFIG_NX_VALIDATORS)).toEqual({
            plugins: [{ slug: 'nx-validators-plugin' } as PluginConfig],
            categories: [
                {
                    slug: 'nx-validators',
                    title: 'Workspace Validation',
                    refs: [],
                },
            ],
        });
    });

    it('should merge nx-validators plugin into persist config', () => {
        expect(mergeConfigs(MOCK_CONFIG_PERSIST, MOCK_CONFIG_NX_VALIDATORS)).toEqual({ ...MOCK_CONFIG_PERSIST, ...MOCK_CONFIG_NX_VALIDATORS });
    });

    it('should merge eslint plugin into config with configured nx-validators plugin', () => {
        expect(mergeConfigs(MOCK_CONFIG_PERSIST, MOCK_CONFIG_NX_VALIDATORS, MOCK_CONFIG_ESLINT)).toEqual({
            persist: {
                outputDir: '.code-pushup/packages/casino/app',
                format: ['json', 'md'],
            },
            plugins: [{ slug: 'nx-validators-plugin' } as PluginConfig, { slug: 'eslint-plugin' } as PluginConfig],
            categories: [
                {
                    slug: 'nx-validators',
                    title: 'Workspace Validation',
                    refs: [],
                },
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
        });
    });

    it('should merge add upload to config', () => {
        expect(mergeConfigs(MOCK_CONFIG_PERSIST, MOCK_CONFIG_ESLINT, MOCK_UPLOAD_CONFIG)).toEqual({
            ...MOCK_CONFIG_PERSIST,
            ...MOCK_CONFIG_ESLINT,
            ...MOCK_UPLOAD_CONFIG,
        });
    });

    it('should merge nx-validators plugin into persist config', () => {
        expect(mergeConfigs(MOCK_CONFIG_PERSIST, MOCK_CONFIG_NX_VALIDATORS)).toEqual({ ...MOCK_CONFIG_PERSIST, ...MOCK_CONFIG_NX_VALIDATORS });
    });
});
