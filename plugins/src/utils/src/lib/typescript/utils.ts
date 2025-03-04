import * as ts from 'typescript';

import { Asset } from '../utils/types';
import { QUOTE_REGEX } from './constants';


export function isComponentDecorator(decorator: ts.Decorator): boolean {
  return isDecorator(decorator, 'Component');
}

export function getDecorators(node: ts.Node): readonly ts.Decorator[] {
  if (ts.getDecorators) {
    return ts.getDecorators(node as ts.HasDecorators) ?? [];
  }
  if (hasDecorators(node)) {
    return node.decorators;
  }
  return [];
}

export function isDecorator(decorator: ts.Decorator, decoratorName?: string): boolean {
  const nodeObject = decorator?.expression as unknown as { expression: ts.Expression };
  const identifierObject = nodeObject?.expression;

  if (identifierObject == null || !ts.isIdentifier(identifierObject)) return false;

  if (decoratorName == null) {
    return true;
  }
  return identifierObject.text === decoratorName;
}

export function assetFromPropertyValueInitializer<T>({
                                                       prop,
                                                       sourceFile,
                                                       textParser,
                                                     }: {
  prop: ts.PropertyAssignment;
  sourceFile: ts.SourceFile;
  textParser: (text: string) => Promise<T>;
}): Asset<T> {
  const { line: startLine } = sourceFile.getLineAndCharacterOfPosition(prop.getStart(sourceFile));
  const value = removeQuotes(prop.initializer, sourceFile);
  return {
    filePath: sourceFile.fileName,
    startLine,
    parse: () => textParser(value),
  } satisfies Asset<T>;
}

export function assetFromPropertyArrayInitializer<T>(
  prop: ts.PropertyAssignment,
  sourceFile: ts.SourceFile,
  textParser: (text: string) => Promise<T>,
): Asset<T>[] {
  const elements: ts.NodeArray<ts.Expression> = ts.isArrayLiteralExpression(prop.initializer)
    ? prop.initializer.elements
    : ts.factory.createNodeArray();

  return elements.map((element) => {
    const { line: startLine } = sourceFile.getLineAndCharacterOfPosition(element.getStart(sourceFile));
    const value = removeQuotes(element, sourceFile);
    return {
      filePath: sourceFile.fileName,
      startLine,
      parse: () => textParser(value),
    } satisfies Asset<T>;
  });
}

export function removeQuotes(node: ts.Node, sourceFile: ts.SourceFile): string {
  return node.getText(sourceFile).replace(QUOTE_REGEX, '');
}

export function hasDecorators(node: ts.Node): node is ts.Node & { decorators: readonly ts.Decorator[] } {
  return 'decorators' in node && Array.isArray(node.decorators);
}
