import * as readline from 'node:readline';
import * as fs from 'node:fs';
import * as path from 'node:path';

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
export async function findFilesWithPattern(
  baseDir: string,
  searchPattern: string
) {
  return (await findInFiles(baseDir, searchPattern, '.ts$', true)).map(({ file }) => file);
}

/**
 * Asynchronously iterates over all `.ts` files in a directory using a queue-based stream-like approach.
 * @param {string} baseDir - The directory to search.
 * @param check
 * @returns {AsyncGenerator<string>} - Yields `.ts` file paths one by one.
 */
export async function* findFiles(
  baseDir: string,
  check: (filePath: string) => boolean = (fullPath) => fullPath.endsWith('.ts')
): AsyncGenerator<string> {
  const queue: string[] = [baseDir];

  while (queue.length > 0) {
    const dir = queue.shift()!;

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
        queue.push(fullPath);
      } else if (entry.isFile() && check(fullPath)) {
        yield fullPath;
      }
    }
  }
}

export function* accessContent(content: string): Generator<string> {
  for (const line of content.split('\n')) {
    yield line;
  }
}

export function getLineHits(
  content: string,
  pattern: string,
  bail = false
): LinePosition[] {
  const hits = [];
  let index = content.indexOf(pattern);

  while (index !== -1) {
    hits.push({ startColumn: index, endColumn: index + pattern.length });
    if (bail) {
      return hits;
    }
    index = content.indexOf(pattern, index + 1);
  }
  return hits;
}

export type LinePosition = {
  startColumn: number;
  endColumn?: number;
};

export type SourcePosition = {
  startLine: number;
  endLine?: number;
} & LinePosition;

export type SourceLocation = {
  file: string;
  position: SourcePosition;
};

export async function findInFile(
  file: string,
  searchPattern: string,
  bail = false
): Promise<SourceLocation[]> {
  const hits: SourceLocation[] = [];
  const content = fs.readFileSync(file, 'utf8');
  let startLine = 0;
  for (const line of accessContent(content)) {
    startLine++;
    getLineHits(line, searchPattern, bail).forEach((position) => {
      hits.push({
        file,
        position: {
          startLine,
          ...position,
        },
      });
    });
  }
  return hits;
}

export async function findInFiles(
  baseDir: string,
  pattern: string,
  glob = '.ts$',
  bail = false
): Promise<SourceLocation[]> {
  const globRegex = glob && typeof glob === 'string' ? new RegExp(glob) : glob;
  const queue: string[] = [baseDir];
  const results: SourceLocation[] = [];

  while (queue.length > 0) {
    const dir = queue.shift()!;

    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (error) {
      console.error(`Error reading directory ${dir}:`, error);
      continue;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        queue.push(fullPath);
      } else if (entry.isFile() && fullPath.match(globRegex)) {
        for (const result of await findInFile(fullPath, pattern, bail)) {
          results.push(result);
        }
      }
    }
  }

  return results;
}
