const nxEslintPlugin = require('@nx/eslint-plugin');

module.exports = [
  {
    plugins: { '@nx': nxEslintPlugin }
  },
  {
    files: ['**/*.ts'],
    rules: {
      'no-restricted-globals': ['error', 'document', 'window'],
      'no-restricted-properties': [
        'error',
        {
          object: 'window',
          property: 'document',
        },
      ],
      '@nx/workspace-no-this-window-document': 'error',
    },
  },
];
