import { readFile } from 'fs/promises';
import { writeFile } from 'node:fs/promises';

async function run() {
  const file = await readFile(
    'plugins/ds-component-coverage/mocks/fixtures/deprecated-styles-usage/deprecated.txt',
    'utf-8'
  );

  await writeFile('plugins/ds-component-coverage/mocks/fixtures/deprecated-styles-usage/deprecate.ts',
    `export const deprecatedCssVars = [
  ${file
      .split('\n')
      .map((line) => `'${line.trim()}'`)
      .join(',\n  ')}
      ];`
  );
}

run();
