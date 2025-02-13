import { readFile } from 'fs/promises';
import { TokenReplacementDefinition } from '../src/lib/runner/audits/style-tokens/types';

export async function loadDeprecatedTokens(
  filePath: string
): Promise<TokenReplacementDefinition[]> {
  const file = await readFile(filePath, 'utf-8');

  return file
    .split('\n')
    .map((line) => line.trim())
    .map((tokenName) => ({
      tokenReplacement: tokenName,
      deprecatedTokens: [
        'semantic-color-ds-accordion-background-active',
        'accordion',
        'accordion-primary',
        'legacy-accordion',
      ],
      docsUrl: 'https://storybook.entaingroup.corp/latest/?path=/docs/tokens',
    }));
}
