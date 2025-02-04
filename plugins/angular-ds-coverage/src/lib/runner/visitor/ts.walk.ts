import ts from 'typescript';
import { TypeScriptAstVisitor } from './ts.visitor';

export function visitEachChild<T>(
  sourceFile: ts.SourceFile,
  visitor: TypeScriptAstVisitor<T>
): void {
  ts.visitEachChild(sourceFile, (node: Node) => ts.visitNode(node, visitor), visitor);
  // Dispatch to specialized visitor
  switch (sourceFile.kind as ts.SyntaxKind) {
    case ts.SyntaxKind.SourceFile:
      visitor.visitSourceFile?.(sourceFile as ts.SourceFile);
      break;
    case ts.SyntaxKind.ClassDeclaration:
      visitor.visitClassDeclaration?.(sourceFile as ts.ClassDeclaration);
      // TypeScript does not provide a way to get decorators directly from a class declaration
      // So we have to visit each decorator manually
      visitor.visitClassDecorators?.(sourceFile as ts.ClassDeclaration);
      for (const decorator of ts.getDecorators(sourceFile) ?? []) {
        if (decorator !== undefined) {
          visitor.visitClassDecorator?.(decorator, sourceFile);
        }
      }
      break;
    case ts.SyntaxKind.FunctionDeclaration:
      visitor.visitFunctionDeclaration?.(sourceFile as ts.FunctionDeclaration);
      break;
    case ts.SyntaxKind.VariableStatement:
      visitor.visitVariableStatement?.(sourceFile as ts.VariableStatement);
      break;
    // ...add more if needed...
    default:
      // Not handled
      break;
  }

  // Recursively traverse children
  ts.forEachChild(sourceFile, (child: Node) => visitEachChild(child, visitor));
}

