import { ESLintUtils } from '@typescript-eslint/utils';
import { relative } from 'node:path';

const REPO_SOURCE_FILE_PATH = 'https://github.com/push-based/code-pushup-design-system/tree/main';

export const eslintRuleFactory = (filePath: string) => ESLintUtils.RuleCreator(() => `${REPO_SOURCE_FILE_PATH}/${relative(process.cwd(), filePath)}`);
