import type { AuditOutputs, Issue, PluginConfig, PluginMeta, RunnerConfig } from '@code-pushup/models';
import { objectToCliArgs } from '@code-pushup/utils';
import { type ReportTypes, type ValidatorId, type WorkspaceValidationResult, getMigrationKitLatestVersion } from '@frontend/migration-kit';
import { join } from 'path';

import { generateAuditsFromValidators, generateGroupsFromValidations } from './utils';

export type WorkspaceValidationPluginOptions = {
    runAll: boolean;
    reports?: ReportTypes;
    reportsOutput: string;
    showPassed?: boolean;
    fileName: string;
};

export const pluginSlug = 'workspace-validation';

export const pluginMeta = (): PluginMeta => ({
    slug: pluginSlug,
    title: 'Workspace validation',
    icon: 'typescript',
    version: getMigrationKitLatestVersion(),
});

export const audits = generateAuditsFromValidators();

export const groups = generateGroupsFromValidations();

export function workspaceValidationPlugin(options: WorkspaceValidationPluginOptions): PluginConfig {
    return {
        ...pluginMeta(),
        audits,
        description: 'A plugin to measure a custom nx workspace setup alignment.',
        groups,
        runner: runnerConfig(options), // TODO: maybe write catch here to print errors?
    };
}

function runnerConfig({ reportsOutput, runAll, fileName }: WorkspaceValidationPluginOptions): RunnerConfig {
    return {
        command: 'yarn',
        args: objectToCliArgs({
            _: ['nx', 'g', '@frontend/migration-kit:validate-workspace'],
            reportsOutput,
            runAll,
            fileName,
            exitOnError: false,
        }),
        outputFile: join(reportsOutput, fileName),
        outputTransform: workspaceValidationReportOutputTransform,
    };
}

function workspaceValidationReportOutputTransform(result: unknown): AuditOutputs {
    const auditOutputs: AuditOutputs = [];
    const workspaceValidationReportOutputTransform = result as WorkspaceValidationResult;
    for (const group in workspaceValidationReportOutputTransform.validationResults) {
        if (group === 'check-manual-steps') {
            continue;
        }
        const validatorResults =
            workspaceValidationReportOutputTransform.validationResults[group as keyof WorkspaceValidationResult['validationResults']]
                .validatorResults;
        for (const slug in validatorResults) {
            const validationId = slug as ValidatorId;
            auditOutputs.push({
                slug,
                value: validatorResults[validationId].status === 'success' ? 1 : 0,
                score: validatorResults[validationId].status === 'success' ? 1 : 0,
                details: {
                    issues: validatorResults[validationId].data.map(
                        ({ status: severity, expected: message }) =>
                            ({
                                message,
                                severity: severity === 'failed' ? 'error' : 'info',
                            }) satisfies Issue,
                    ),
                },
            });
        }
    }
    return auditOutputs;
}

export default workspaceValidationPlugin;
