import { fastFindInFiles, FastFindInFiles } from 'fast-find-in-files';
import ts, { type Node } from 'typescript';
import { ANGULAR_COMPONENT_REGEX, styleAndTemplateProps } from './constants';
import { ParsedDecoratorConfig, Props } from './types';

/**
 * Finds and parses Angular components in a directory.
 * It uses `fast-find-in-files` to find the components and `typescript` to parse them.
 *
 * @param opt Options with the directory to search for components.
 * @returns Array of `ParsedComponent`.
 */
export function findAndParseComponents(opt: { directory: string }) {
  const filteredComponents = fastFindInFiles({
    ...opt,
    needle: ANGULAR_COMPONENT_REGEX, // Needle to search for Angular components (it does not catch if the class is imported for Angular)
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
): ParsedDecoratorConfig[] {
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
      /*
      @TODO Use the visitor to extract the components
      const visitor = new DecoratorAssetsVisitor();
      visitEachChild<ParsedDecoratorConfig>(sourceFile, visitor);
      return visitor.getComponents();
      */
      return parseSourceFile(sourceFile);
    });
}

/**
 * Extracts Angular component details from a TypeScript source file.
 * @param sourceFile TypeScript source file.
 * @returns Array of `ParsedComponent`.
 */
function parseSourceFile(sourceFile: ts.SourceFile) {
  const components: ParsedDecoratorConfig[] = [];

  ts.visitEachChild(sourceFile, (node: Node) => {
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

      const component: ParsedDecoratorConfig = {
        className,
        decoratorName,
        filePath: sourceFile.fileName,
      };

      components.push(
        getComponentWithExtractedDecoratorArguments(
          component,
          decorator.expression.arguments,
          sourceFile
        )
      );
    });
  });

  return components;
}

/**
 * Gets the component with the decorator arguments extracted.
 * @param component Parsed component.
 * @param args Decorator arguments.
 * @param sourceFile TypeScript source file.
 * @returns Parsed component with the decorator arguments extracted.
 */
function getComponentWithExtractedDecoratorArguments(
  component: ParsedDecoratorConfig,
  args: ts.NodeArray<ts.Expression>,
  sourceFile: ts.SourceFile
): ParsedDecoratorConfig {
  if (args.length === 0 || !ts.isObjectLiteralExpression(args[0])) {
    return component;
  }

  return args[0].properties.reduce((acc, prop) => {
    if (!ts.isPropertyAssignment(prop) || !ts.isIdentifier(prop.name)) {
      return acc;
    }

    const propName = prop.name.escapedText as Props;
    if (!styleAndTemplateProps.includes(propName)) {
      return acc;
    }

    const startLine = sourceFile.getLineAndCharacterOfPosition(
      prop.initializer.pos
    ).line;

    if (propName === 'templateUrl' || propName === 'template') {
      return {
        ...acc,
        [propName]: {
          value: prop.initializer
            .getText(sourceFile)
            .replace(/^['"]|['"]$/g, ''),
          startLine,
        },
      };
    }

    if (propName === 'styles' || propName === 'styleUrls') {
      return {
        ...acc,
        [propName]: extractArrayValues(prop.initializer, startLine, sourceFile),
      };
    }

    return acc;
  }, component);
}

/**
 * Extracts values from an array initializer.
 * @param node Array initializer.
 * @param startLine Start line of the array initializer.
 * @param sourceFile TypeScript source file.
 * @returns Array of `ParsedAsset`.
 */
function extractArrayValues(
  node: ts.Expression,
  startLine: number,
  sourceFile: ts.SourceFile
) {
  if (ts.isArrayLiteralExpression(node) === false) return [];
  return node.elements.map((element) => {
    switch (element.kind) {
      case ts.SyntaxKind.StringLiteral:
        return {
          value: element.getText(sourceFile).replace(/^['`"]|['"]$/g, ''), // Remove quotes
          startLine,
        };
      case ts.SyntaxKind.FirstTemplateToken:
        return {
          value: element.getText(sourceFile).replace(/^['`"]|['"]$/g, ''),
          startLine,
        };
    }
  });
}
