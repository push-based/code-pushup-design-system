import { Dirent } from 'node:fs';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

/**
 * Recursively searches for `.ts` files that contain `searchPattern`.
 * @param baseDir       Root directory to search (absolute or relative).
 * @param searchPattern String or RegExp to look for.
 * @param excludedDirs  Directory names to ignore (e.g. ["node_modules", "dist"]).
 */
export async function findFilesWithPattern(
  baseDir: string,
  searchPattern: string | RegExp,
  excludedDirs: string[] = []
): Promise<string[]> {
  const resolvedBaseDir = path.resolve(baseDir);

  const tsFiles: string[] = [];
  for await (const file of findAllFiles(
    resolvedBaseDir,
    (f) => f.endsWith('.ts') && !f.endsWith('.spec.ts'),
    excludedDirs
  )) {
    tsFiles.push(file);
  }

  const resultsNested = await Promise.all(
    tsFiles.map(async (file) => {
      try {
        return await findInFile(file, searchPattern);
      } catch (error) {
        console.error(`Error searching file ${file}:`, error);
        return [];
      }
    })
  );

  return [...new Set(resultsNested.flat().map((hit) => hit.file))];
}

/**
 * Async generator that yields each file path beneath `baseDir` satisfying `predicate`.
 */
async function* findAllFiles(
  baseDir: string,
  predicate: (file: string) => boolean = (p) => p.endsWith('.ts'),
  excludedDirs: string[] = []
): AsyncGenerator<string> {
  const entries = await getDirectoryEntries(baseDir);

  for (const entry of entries) {
    const fullPath = path.join(baseDir, entry.name);
    if (entry.isDirectory()) {
      if (!isExcludedDirectory(entry.name, excludedDirs)) {
        yield* findAllFiles(fullPath, predicate, excludedDirs);
      }
    } else if (entry.isFile() && predicate(fullPath)) {
      yield fullPath;
    }
  }
}

function isExcludedDirectory(name: string, excludedDirs: string[]): boolean {
  return name.startsWith('.') || excludedDirs.includes(name);
}

async function getDirectoryEntries(dir: string): Promise<Dirent[]> {
  try {
    return await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    return [];
  }
}

export type LinePosition = {
  startColumn: number;
  endColumn?: number;
};

export type SourcePosition = {
  startLine: number;
} & LinePosition;

export type SourceLocation = {
  file: string;
  position: SourcePosition;
};

function getLineHits(
  content: string,
  searchPattern: RegExp,
  bail = false
): LinePosition[] {
  const hits: LinePosition[] = [];
  let match: RegExpExecArray | null;
  let pattern = searchPattern;
  pattern.lastIndex = 0;
  while ((match = pattern.exec(content)) !== null) {
    hits.push({
      startColumn: match.index,
      endColumn: match.index + match[0].length,
    });
    if (bail) break;
  }
  return hits;
}

/**
 * Reads an entire file asynchronously and returns all matches.
 */
export async function findInFile(
  file: string,
  searchPattern: string | RegExp,
  bail = false
): Promise<SourceLocation[]> {
  const regex =
    typeof searchPattern === 'string'
      ? new RegExp(searchPattern, 'g')
      : new RegExp(searchPattern, 'g');
  const hits: SourceLocation[] = [];
  const content = await fs.readFile(file, 'utf8');

  let lineNumber = 0;
  for (const line of content.split(/\r?\n/)) {
    lineNumber += 1;
    const lineHits = getLineHits(line, regex, bail);
    lineHits.forEach((hit) =>
      hits.push({
        file,
        position: { startLine: lineNumber, ...hit },
      })
    );
    if (bail && hits.length) break;
  }

  return hits;
}
