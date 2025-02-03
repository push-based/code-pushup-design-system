import { Audit, CategoryRef, Group } from '@code-pushup/models';
import { ValidatorType, WORKSPACE_VALIDATIONS } from '@frontend/migration-kit';
import { readFileSync, readdirSync } from 'fs';
import { Dirent } from 'node:fs';
import { join } from 'path';

const VALIDATORS_FOLDER = 'packages/migration-kit/src/workspace-validation/validators';

function generateAuditFromValidatorPath(validatorPath: string, slug: string): Audit {
    const readmePath = join(validatorPath, slug, 'README.md');
    const readmeText = readFileSync(readmePath, 'utf8');

    const title = readmeText.match(/^# (.*)/)?.[1] || '' + '';
    const description = readmeText.match(/## Description\n(.*)/)?.[1] || '';
    return {
        slug,
        title,
        description,
    };
}

function readValidatorsFolder(validatorType: ValidatorType): Dirent[] {
    return readdirSync(`${VALIDATORS_FOLDER}/${validatorType}`, { withFileTypes: true });
}

export function generateAuditsFromValidators(): Audit[] {
    const workspaceValidatorsFolder = readValidatorsFolder(ValidatorType.WORKSPACE);
    const projectValidatorsFolder = readValidatorsFolder(ValidatorType.PROJECT);
    const validatorPaths = [...workspaceValidatorsFolder, ...projectValidatorsFolder]
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => ({ validatorPath: dirent.parentPath, slug: dirent.name }));
    return validatorPaths.map(({ validatorPath, slug }) => generateAuditFromValidatorPath(validatorPath, slug));
}

export function generateGroupsFromValidations(): Group[] {
    return Object.entries(WORKSPACE_VALIDATIONS)
        .filter(([key]) => key !== 'check-manual-steps')
        .reduce(
            (acc: Group[], [slug, { name, validatorIds, description }]) => [
                ...acc,
                {
                    slug,
                    description,
                    title: name,
                    refs: validatorIds.map((validatorId) => ({
                        slug: validatorId,
                        weight: 1,
                    })),
                },
            ],
            [],
        );
}

export function generateCategoriesRefs(): CategoryRef[] {
    return Object.entries(WORKSPACE_VALIDATIONS)
        .filter(([slug]) => slug !== 'check-manual-steps')
        .map(([validationId, { description }]) => ({
            type: 'group',
            description,
            slug: validationId,
            plugin: 'workspace-validation',
            weight: 1,
        }));
}
