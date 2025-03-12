const baseConfig = require('../../eslint.config.cjs');
const jsonc = require('jsonc-eslint-parser');

module.exports = [
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: ['{projectRoot}/vite.config.{js,ts,mjs,mts}'],
        },
      ],
    },
    languageOptions: {
      parser: jsonc,
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['packages/workspace-validation-utils/tsconfig.*?.json'],
      },
    },
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          allow: [
            '@code-pushup/core',
            '@code-pushup/models',
            '@code-pushup/utils',
          ],
        },
      ],
    },
  },
];
