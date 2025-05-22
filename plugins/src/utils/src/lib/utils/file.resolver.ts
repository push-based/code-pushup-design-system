import { readFile } from 'node:fs/promises';

export const fileResolverCache = new Map<string, Promise<string>>();

/**
 * Resolves a file content from the file system, caching the result
 * to avoid reading the same file multiple times.
 *
 * This function returns a Promise that resolves to the file content.
 * This is important to avoid reading the same file multiple times.
 * @param filePath
 */
export async function resolveFileCached(filePath: string): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (fileResolverCache.has(filePath)) return fileResolverCache.get(filePath)!;
  const fileContent = readFile(filePath, 'utf8')
    .then((content) => {
      fileResolverCache.set(filePath, Promise.resolve(content));
      return content;
    })
    .catch((error) => {
      throw error;
    });

  fileResolverCache.set(filePath, fileContent);

  return fileContent;
}
