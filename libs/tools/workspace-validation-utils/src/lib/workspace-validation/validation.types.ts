import { ProjectConfiguration, Tree } from '@nx/devkit';

import * as generatorsSchema from '../../generators.json';

export type ValidatorId = Exclude<keyof typeof generatorsSchema.generators, 'validate-workspace'>;

export const enum ValidatorType {
    WORKSPACE = 'workspace',
    PROJECT = 'project',
}

export interface Validation {
    name: string;
    description: string;
    validatorIds: ValidatorId[];
}

export const VALIDATION_IDS = [
    'use-nx-tooling',
    'use-quality-tooling',
    'use-workspace-layout',
    'normalize-typescript-config',
    'use-dev-kit',
    'check-manual-steps',
];

export type ValidationId = (typeof VALIDATION_IDS)[number];

export type WorkspaceValidation = Record<ValidationId, Validation>;

export type ResultStatus = 'success' | 'failed' | 'skip' | 'info';

export type TotalStatus = Record<Exclude<ResultStatus, 'info'>, number>;

export type DataLog = {
    expected: string;
    status: ResultStatus;
    log?: string;
};

export interface ValidatorResult {
    status: ResultStatus;
    data: DataLog[];
}

export type ValidatorResultWithDoc = ValidatorResult & { documentation: string };

export type Validator = (tree: Tree, projectsMap?: Record<string, ProjectConfiguration>) => Promise<DataLog[]>;

export type ValidatorModule = { default: Validator };

export interface ValidationResult {
    name: string;
    description: string;
    status: ResultStatus;
    total: TotalStatus;
    validatorResults: Record<ValidatorId, ValidatorResultWithDoc>;
}

export type WorkspaceValidationResult = {
    created: number;
    status: ResultStatus;
    total: TotalStatus;
    validationResults: Record<ValidationId, ValidationResult>;
};
