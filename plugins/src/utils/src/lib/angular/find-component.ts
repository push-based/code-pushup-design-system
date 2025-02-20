import { fastFindInFiles } from 'fast-find-in-files';
import { fdir } from 'fdir';
import { dirname } from 'node:path';

/** Angular component decorator regex. */
export const ANGULAR_COMPONENT_REGEX = '@Component';

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
  console.log('directories', directories)
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
