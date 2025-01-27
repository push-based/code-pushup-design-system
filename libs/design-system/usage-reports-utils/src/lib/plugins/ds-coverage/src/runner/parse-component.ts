import ts from 'typescript';
import { fastFindInFiles, FastFindInFiles } from 'fast-find-in-files';
import { ParsedAsset, ParsedComponent, Props } from './types';
import { styleAndTemplateProps } from './constants';

/**
 * Finds and parses Angular components in a directory.
 * It uses `fast-find-in-files` to find the components and `typescript` to parse them.
 *
 * It returns an array of `ParsedComponent`.
 * @param opt
 */
export function findAndParseComponents(opt: {
  directory: string;
}): ParsedComponent[] {
  // Needle to search for Angular components (it does not catch if the class is imported for Angular)
  const needle = '@Component';

  const filteredComponents: FastFindInFiles[] = fastFindInFiles({
    ...opt,
    needle,
  }).filter(({ totalHits }) => totalHits > 0);

  return parseComponents(filteredComponents);
}

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
    .filter((file) => filePaths.has(file.fileName))
    .flatMap(parseSourceFile);
}

/**
 * Extracts Angular component details from a TypeScript source file.
 */
function parseSourceFile(sourceFile: ts.SourceFile): ParsedComponent[] {
  const components: ParsedComponent[] = [];

  ts.forEachChild(sourceFile, (node) => {
    if (
      !ts.isClassDeclaration(node) ||
      node.kind !== ts.SyntaxKind.ClassDeclaration
    ) {
      return;
    }

    const className = node.name?.text ?? 'UnnamedClass';

    (ts.getDecorators(node) ?? []).forEach((decorator) => {
      if (!ts.isCallExpression(decorator.expression)) return;
      const expression = decorator.expression.expression;
      if (!ts.isIdentifier(expression)) return;

      const decoratorName = expression.text;
      const component: ParsedComponent = {
        className,
        decoratorName,
        filePath: sourceFile.fileName,
      };

      parseDecoratorArguments(
        decorator.expression.arguments,
        component,
        sourceFile
      );
      components.push(component);
    });
  });

  return components;
}

/**
 * Parses the arguments of a decorator to extract component metadata.
 */
function parseDecoratorArguments(
  args: ts.NodeArray<ts.Expression>,
  component: ParsedComponent,
  sourceFile: ts.SourceFile
): void {
  if (args.length === 0 || !ts.isObjectLiteralExpression(args[0])) return;

  args[0].properties.forEach((prop) => {
    if (!ts.isPropertyAssignment(prop) || !ts.isIdentifier(prop.name)) return;

    const propName = prop.name.escapedText as Props;
    if (!styleAndTemplateProps.includes(propName)) return;

    const startLine = sourceFile.getLineAndCharacterOfPosition(
      prop.initializer.pos
    ).line;

    if (propName === 'templateUrl' || propName === 'template') {
      component[propName] = {
        value: prop.initializer.getText(sourceFile).replace(/^['"]|['"]$/g, ''), // Remove quotes
        startLine,
      };
    } else if (propName === 'styles' || propName === 'styleUrls') {
      component[propName] = extractArrayValues(
        prop.initializer,
        startLine,
        sourceFile
      );
    }
  });
}

/**
 * Extracts values from an array initializer.
 */
function extractArrayValues(
  node: ts.Expression,
  startLine: number,
  sourceFile: ts.SourceFile
): ParsedAsset[] {
  if (!ts.isArrayLiteralExpression(node)) return [];

  return node.elements.filter(ts.isStringLiteral).map((element) => ({
    value: element.getText(sourceFile).replace(/^['"]|['"]$/g, ''), // Remove quotes
    startLine,
  }));
}
