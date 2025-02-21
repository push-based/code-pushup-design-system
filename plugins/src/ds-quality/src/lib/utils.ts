import { readTextFile } from '@code-pushup/utils';
import { DeprecationDefinition } from './runner/audits/types';

export async function readLinesFromTextFile(
  filePath: string
): Promise<string[]> {
  return await readTextFile(filePath).then((res) => {
    const tokenArray = res
      .trim()
      .split(/(\r\n|\r|\n)/)
      .filter((x) => x != null && x.trim() !== '');
    return Array.from(new Set(tokenArray));
  });
}

export async function readDeprecatedVariables(
  filePath: string
): Promise<DeprecationDefinition[]> {
  return (await readLinesFromTextFile(filePath)).map((token) => ({
    deprecatedEntity: token.replace('--', ''),
  }));
}

export async function readDeprecatedMixins(
  filePath: string
): Promise<DeprecationDefinition[]> {
  return (await readLinesFromTextFile(filePath)).map((token) => ({
    deprecatedEntity: token,
  }));
}
