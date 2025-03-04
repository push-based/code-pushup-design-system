import * as readline from 'node:readline';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';

/**
 * Reads a file line-by-line and checks if it contains the search pattern.
 * @param {string} filePath - The file to check.
 * @param {RegExp | string} searchPattern - The pattern to match.
 * @returns {Promise<boolean>} - True if the pattern is found.
 */
async function fileContainsPattern(
  filePath: string,
  searchPattern: string | RegExp
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const rl = readline.createInterface({ input: stream });

    let searchPatternFound = false;

    rl.on('line', (line) => {

      if (
        typeof searchPattern === 'string'
          ? line.includes(searchPattern)
          : searchPattern.test(line)
      ) {
        searchPatternFound = true;
        resolve(searchPatternFound);
        rl.close();
        stream.destroy();
      }
    });

    rl.on('close', () => resolve(searchPatternFound));
    rl.on('error', reject);
  });
}

/**
 * Searches for `.ts` files containing the search pattern.
 * @param {string} baseDir - The directory to search.
 * @param {RegExp | string} searchPattern - The pattern to match.
 */
export async function findFilesWithPattern(baseDir: string, searchPattern: string) {

  const l = [];
  for await (const filePath of findTsFiles(baseDir)) {

    if (await fileContainsPattern(filePath, searchPattern)) {
      l.push(path.join(process.cwd(), filePath));
    }
  }
  return l;
}

/**
 * Asynchronously iterates over all `.ts` files in a directory using a queue-based stream-like approach.
 * @param {string} baseDir - The directory to search.
 * @returns {AsyncGenerator<string>} - Yields `.ts` file paths one by one.
 */
async function* findTsFiles(baseDir: string): AsyncGenerator<string> {
  const queue: string[] = [baseDir]; // Use a queue to avoid deep recursion

  while (queue.length > 0) {
    const dir = queue.shift()!; // Get the next directory from the queue

    let entries;
    try {
      entries = await fs.promises.readdir(dir, { withFileTypes: true });
    } catch (err) {
      console.error(`Error reading directory ${dir}:`, err);
      continue;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        queue.push(fullPath); // Add directories to queue instead of recursing
      } else if (entry.isFile() && fullPath.endsWith('.ts')) {
        yield fullPath; // Yield file paths lazily
      }
    }
  }
}
