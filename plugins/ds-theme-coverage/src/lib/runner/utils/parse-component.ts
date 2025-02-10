import { FastFindInFiles } from 'fast-find-in-files';
import ts from 'typescript';
import { ParsedComponent } from './types';
import { classDecoratorVisitor } from '../typescript/decorator-config.visitor';

/**
 * Parses Angular components from a `FastFindInFiles` result.
 * It uses `typescript` to parse the components source files and extract the decorators.
 * From the decorators, it extracts the `@Component` decorator and its properties.
 * The used properties are `templateUrl`, `template`, `styles`, and `styleUrls`.
 *
 * @param crawlerResult
 */
export function parseComponents(
  crawlerResult: FastFindInFiles[]
): ParsedComponent[] {
  const filePaths = new Set(crawlerResult.map((file) => file.filePath));

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

      ts.visitEachChild(sourceFile, visitor);
      return [...visitor.components];
    });
}
