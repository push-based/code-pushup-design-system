// Implement a custom visitor
import { TypeScriptAstVisitor } from './ts.visitor';
import ts from 'typescript';
import { ParsedComponent, Props } from '../types';
import { styleAndTemplateProps } from '../constants';

export class DecoratorAssetsVisitor implements TypeScriptAstVisitor<void> {
  private readonly components: ParsedComponent[] = [];

  getComponents(): ParsedComponent[] {
    return this.components;
  }

  visitClassDecorator(decorator: ts.Decorator, context?: ts.ClassDeclaration) {
    if (!ts.isCallExpression(decorator.expression)) return;

    const expr = decorator.expression.expression;
    if (!ts.isIdentifier(expr)) return;

    if (expr.text === 'Component') {
      const args = decorator.expression.arguments;
      if (args.length === 0 || !ts.isObjectLiteralExpression(args[0])) {
        return;
      }
      this.components.push(getParsedDecoratorConfig(expr, args, context));
    }
    return;
  }
}

/**
 * Gets the component with the decorator arguments extracted.
 * @param expr
 * @param args Decorator arguments.
 * @param context
 * @returns Parsed component with the decorator arguments extracted.
 */
function getParsedDecoratorConfig(
  expr: ts.Expression,
  args: ts.NodeArray<ts.Expression>,
  context: ts.ClassDeclaration
): ParsedComponent {
  const className = context.name?.text ?? 'UnnamedClass';
  const sourceFile = context.getSourceFile();

  return args[0].properties.reduce(
    (acc: ParsedComponent, prop: ts.Expression) => {
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
          [propName]: extractArrayValues(
            prop.initializer,
            startLine,
            sourceFile
          ),
        };
      }

      return acc;
    },
    {
      className,
      decoratorName: expr.text,
      filePath: sourceFile.fileName,
    }
  );
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
  if (!ts.isArrayLiteralExpression(node)) return [];

  return node.elements.filter(ts.isStringLiteral).map((element) => ({
    value: element.getText(sourceFile).replace(/^['"]|['"]$/g, ''), // Remove quotes
    startLine,
  }));
}
