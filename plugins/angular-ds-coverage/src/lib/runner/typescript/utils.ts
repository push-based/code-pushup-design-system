import ts from 'typescript';
import { Asset } from '../utils/types';

export function isComponentDecorator(decorator: ts.Decorator): boolean {
  return isDecorator(decorator, 'Component');
}

export function getDecorators(node: ts.Node) {
  return (ts.getDecorators ? ts.getDecorators(node) : node.decorators) ?? []; // TS 5+ compatibility
}

export function isDecorator(
  decorator: ts.Decorator,
  decoratorName?: string
): boolean {
  const nodeObject: ts.NodeObject = decorator?.expression;
  const identifierObject: ts.IdentifierObject = nodeObject?.expression;

  if (identifierObject == null || !ts.isIdentifier(identifierObject))
    return false;

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
  const { line: startLine } = sourceFile.getLineAndCharacterOfPosition(
    prop.getStart(sourceFile)
  );
  const value = extractStringValue(prop.initializer, sourceFile);
  return {
    filePath: sourceFile.fileName,
    startLine,
    source: () => prop,
    parse: () => textParser(value),
  } satisfies Asset<T>;
}

export function assetFromPropertyArrayInitializer<T>(
  prop: ts.PropertyAssignment,
  sourceFile: ts.SourceFile,
  textParser: (text: string) => Promise<T>
): Asset<T>[] {
  return (prop.initializer.elements ?? []).map((element: ts.Node) => {
    const { line: startLine } = sourceFile.getLineAndCharacterOfPosition(
      element.getStart(sourceFile)
    );
    const value = extractStringValue(element, sourceFile);
    return {
      filePath: sourceFile.fileName,
      startLine,
      source: () => element as unknown as T,
      parse: () => textParser(value),
    } satisfies Asset<T>;
  });
}

export function extractStringValue(
  node: ts.Node,
  sourceFile: ts.SourceFile
): string {
  return node.getText(sourceFile).replace(/^['"]|['"]$/g, '');
}
