import { readTextFile } from '@code-pushup/utils';

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
