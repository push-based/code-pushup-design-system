import { fastFindInFiles } from 'fast-find-in-files';
/** Angular component decorator regex. */
export const ANGULAR_COMPONENT_REGEX = '@Component';

/**
 * Finds and parses Angular components in a directory.
 * It uses `fast-find-in-files` to find the components and `typescript` to parse them.
 *
 * @param opt Options with the directory to search for components.
 * @returns Array of `ParsedComponent`.
 */
export function findComponents(opt: { directory: string }) {
  return fastFindInFiles({
    ...opt,
    needle: ANGULAR_COMPONENT_REGEX, // Needle to search for Angular components (it does not catch if the class is imported for Angular)
  }).filter(({ totalHits }) => totalHits > 0);
}
