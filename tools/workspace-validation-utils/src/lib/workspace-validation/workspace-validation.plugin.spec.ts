 
import { executePlugin } from '@code-pushup/core';
import { auditSchema, categoryRefSchema, pluginConfigSchema, pluginReportSchema } from '@code-pushup/models';
import { getMigrationKitLatestVersion } from '@frontend/migration-kit';
import { pathExistsSync } from 'fs-extra';
import { join } from 'path';
import { describe, expect, it } from 'vitest';

import { generateCategoriesRefs } from './utils';
import { WorkspaceValidationPluginOptions, audits, groups, pluginSlug as slug, workspaceValidationPlugin } from './workspace-validation.plugin';

const EXECUTION_TIMEOUT = 200000;

describe('workspaceValidationPlugin', () => {
    const baseOptions: WorkspaceValidationPluginOptions = {
        runAll: true,
        reports: ['console', 'json'],
        reportsOutput: 'dist/test/libs/tools/workspace-validation-utils/reports',
        fileName: 'report.json',
    };

    it('should return valid PluginConfig', async () => {
        const pluginConfig = workspaceValidationPlugin(baseOptions);
         
        expect(() => pluginConfigSchema.parse(pluginConfig)).not.toThrow();
        expect(pluginConfig).toEqual({
            audits,
            description: 'A plugin to measure a custom nx workspace setup alignment.',
            title: 'Workspace validation',
            icon: 'typescript',
            runner: expect.any(Object),
            version: getMigrationKitLatestVersion(),
            groups,
            slug,
        });
    });

    it(
        'should return PluginConfig that executes correctly',
        {
            timeout: EXECUTION_TIMEOUT,
        },
        async () => {
            const pluginConfig = workspaceValidationPlugin(baseOptions);
            const pluginOutput = await executePlugin(pluginConfig);

             
            expect(() => pluginReportSchema.parse(pluginOutput)).not.toThrow();
            await expect(executePlugin(pluginConfig)).resolves.toMatchObject({
                slug,
                description: 'A plugin to measure a custom nx workspace setup alignment.',
                title: 'Workspace validation',
                icon: 'typescript',
                duration: expect.any(Number),
                date: expect.any(String),
                audits: expect.any(Array),
                groups: expect.any(Array),
            });
        },
    );

    it(
        'should use custom report output path',
        {
            timeout: EXECUTION_TIMEOUT,
        },
        async () => {
            const reportsOutput = '.code-pushup';
            const fileName = 'workspace-validation-report.json';
            const pluginConfig = workspaceValidationPlugin({
                ...baseOptions,
                reportsOutput,
                fileName,
            });
            await executePlugin(pluginConfig);
            const reportPath = join(reportsOutput, fileName);
            expect(pathExistsSync(reportPath)).toBeTruthy();
        },
    );
});

describe('audits', () => {
    it.each(audits)('should be a valid audit meta info', (audit) => {
         
        expect(() => auditSchema.parse(audit)).not.toThrow();
    });
});

describe('recommendedRefs', () => {
    it.each(generateCategoriesRefs())('should be a valid category reference', (categoryRef) => {
         
        expect(() => categoryRefSchema.parse(categoryRef)).not.toThrow();
    });
});
