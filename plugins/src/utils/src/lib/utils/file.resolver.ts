import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import * as path from 'path';

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
  const normalizedPath = path.normalize(filePath);
  if (!existsSync(normalizedPath)) {
    throw new Error(`File not found: ${normalizedPath}`);
  }

  if (fileResolverCache.has(normalizedPath)) {
    const cachedPromise = fileResolverCache.get(normalizedPath);
    if (cachedPromise) {
      return cachedPromise;
    }
  }

  // Store the promise in the cache immediately (forwarding concurrent requests into the same Promise)
  const fileContentPromise = readFile(normalizedPath, 'utf-8')
    .then((content) => {
      fileResolverCache.set(normalizedPath, Promise.resolve(content)); // Store resolved content
      return content;
    })
    .catch((error) => {
      throw error;
    });

  fileResolverCache.set(normalizedPath, fileContentPromise);

  return fileContentPromise;
}
