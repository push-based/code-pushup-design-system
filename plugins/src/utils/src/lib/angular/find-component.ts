import { fdir } from 'fdir';
import { dirname } from 'node:path';
import { crawlFileSystem, readTextFile } from '@code-pushup/utils';

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
