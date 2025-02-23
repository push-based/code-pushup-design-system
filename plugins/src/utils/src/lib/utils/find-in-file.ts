import * as fs from 'node:fs';
import fg from 'fast-glob';
import * as readline from 'node:readline';

/**
 * Recursively finds all `.ts` files and filters those containing the given search pattern.
 * @param {string} baseDir - The directory to search.
 * @param {RegExp | string} searchPattern - The string or regex to search for.
 * @returns {Promise<string[]>} - List of matching file paths.
 */
export async function findFilesWithPattern(baseDir: string, searchPattern: string): Promise<string[]> {
  const tsFiles = await fg([`${baseDir}/**/*.ts`], { absolute: true });

  const matchingFiles = [];
  for (const filePath of tsFiles) {
    if (await fileContainsPattern(filePath, searchPattern)) {
      matchingFiles.push(filePath);
    }
  }

  return matchingFiles;
}

/**
 * Reads a file line-by-line to check if it contains the specified pattern.
 * @param {string} filePath - The file to check.
 * @param {RegExp | string} searchPattern - The pattern to match.
 * @returns {Promise<boolean>} - True if the pattern is found.
 */
async function fileContainsPattern(filePath: string, searchPattern: string | RegExp): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const rl = readline.createInterface({ input: stream });

    rl.on('line', (line) => {
      if (typeof searchPattern === 'string' ? line.includes(searchPattern) : searchPattern.test(line)) {
        rl.close();
        stream.destroy();
        resolve(true);
      }
    });

    rl.on('close', () => resolve(false));
    rl.on('error', reject);
  });
}
