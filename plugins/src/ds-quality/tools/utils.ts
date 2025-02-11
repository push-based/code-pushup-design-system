import { readFile } from 'fs/promises';

export function loadDeprecatedTokens(): string[] {
  const file = await readFile(
    'plugins/ds-component-coverage/mocks/fixtures/deprecated-styles-usage/deprecated.txt',
    'utf-8'
  );

  return file
    .split('\n')
    .map((line) => line.trim())
    .map((tokenName) => ({
      tokenName,
      deprecatedTokens: [
        'semantic-color-ds-accordion-background-active',
        'accordion',
        'accordion-primary',
        'legacy-accordion',
      ],
      docsUrl: 'https://storybook.entaingroup.corp/latest/?path=/docs/tokens',
    }));
}
