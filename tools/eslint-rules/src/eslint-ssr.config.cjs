module.exports = [
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
  {
    files: ['**/*.spec.ts'],
    rules: {
      'no-restricted-globals': 'off',
    },
  },
];
