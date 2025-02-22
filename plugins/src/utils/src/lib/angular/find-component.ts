import { fdir } from 'fdir';
import { dirname } from 'node:path';
import { crawlFileSystem, readTextFile } from '@code-pushup/utils';
import {fastFindInFiles} from 'fast-find-in-files';

/** Angular component decorator regex. */
export const ANGULAR_COMPONENT_REGEX = /@Component/gm;

/**
 * Finds and parses Angular components in a directory.
 *
 * @param opt Options with the directory to search for components.
 * @returns Array of `ParsedComponent`.
 */
export async function findComponents(opt: { directory: string }) {
  // get all sub-folders of the passed directory
  const files = await new fdir()
    .withFullPaths()
    .filter((f) => f.endsWith('.ts'))
    .crawl(opt.directory)
    .withPromise();
  const directories = Array.from(new Set(files.map((file) => dirname(file))));

  return directories
    .flatMap((directory) =>
      fastFindInFiles({
        directory,
        // Needle to search for Angular components (it does not catch if the class is imported for Angular or not)
        needle: ANGULAR_COMPONENT_REGEX,
      })
    )
    .filter(({ filePath }) => filePath.endsWith('.ts'))
    .filter(({ totalHits }) => totalHits > 0);
}

export async function _findComponents(opt: { directory: string }) {
  // get all sub-folders of the passed directory
  const files = await fDirFiles(opt.directory);
  const directories = Array.from(new Set(files.map((file) => dirname(file))));
  const results = await Promise.all(
    directories.map(async (directory) =>
      crawlFileSystem({
        directory,
        fileTransform: async (filePath: string) => {
          const content = await readTextFile(filePath);
          return {
            filePath,
            totalHits: content.match(ANGULAR_COMPONENT_REGEX)?.length ?? 0,
          };
        },
      })
    )
  );

  return results
    .flat()
    .filter(({ filePath }) => filePath.endsWith('.ts'))
    .filter(({ totalHits }) => totalHits > 0);
}

export function fDirFiles(directory: string) {
  try {
    return new fdir()
      .withFullPaths()
      .filter((f) => f.endsWith('.ts'))
      .crawl(directory)
      .withPromise();
  } catch (e) {
    throw new Error(`Could not get file for directory: ${directory}`);
  }
}
