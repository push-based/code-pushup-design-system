import { toUnixPath } from '@code-pushup/utils';
import * as ts from 'typescript';

import { classDecoratorVisitor } from '../typescript/decorator-config.visitor';
import { ParsedComponent } from './types';

/**
 * Parses Angular components from a `FastFindInFiles` result.
 * It uses `typescript` to parse the components source files and extract the decorators.
 * From the decorators, it extracts the `@Component` decorator and its properties.
 * The used properties are `templateUrl`, `template`, `styles`, and `styleUrls`.
 *
 * @param files
 */
export function parseComponents(files: string[]): ParsedComponent[] {
  const filePaths = new Set(files.map((filePath) => toUnixPath(filePath)));

  const program = ts.createProgram([...filePaths], {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.ESNext,
    experimentalDecorators: true,
  });

  return program
    .getSourceFiles()
    .filter((file: ts.SourceFile) => filePaths.has(file.fileName))
    .flatMap((sourceFile: ts.SourceFile) => {
      const visitor = classDecoratorVisitor({ sourceFile });

      ts.visitEachChild(sourceFile, visitor, undefined);
      return visitor.components;
    });
}
