import { readFile } from 'fs/promises';

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
  if (fileResolverCache.has(filePath)) {
    const cachedPromise = fileResolverCache.get(filePath);
    if (cachedPromise) {
      return cachedPromise;
    }
  }

  // Store the promise in the cache immediately (forwarding concurrent requests into the same Promise)
  const fileContentPromise = readFile(filePath, 'utf-8').then((content) => {
    fileResolverCache.set(filePath, Promise.resolve(content)); // Store resolved content
    return content;
  });

  fileResolverCache.set(filePath, fileContentPromise);

  return fileContentPromise;
}

export function invalidateFileCache(filePath?: string): void {
  if (filePath) {
    fileResolverCache.delete(filePath);
  } else {
    fileResolverCache.clear();
  }
}
