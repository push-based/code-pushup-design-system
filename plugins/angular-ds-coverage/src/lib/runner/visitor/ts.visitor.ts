import ts from 'typescript';

/**
 * A custom visitor interface defining how to handle each node kind
 * you care about. Extend with more node kinds as needed.
 */
export interface TypeScriptAstVisitor<T = void> extends ts.Visitor{
  visitSourceFile?(node: ts.SourceFile): T;
  visitClassDeclaration?(node: ts.ClassDeclaration): T;
  visitClassDecorators?(node: ts.Decorator[]): T;
  visitClassDecorator?(node: ts.Decorator, context: ts.ClassDeclaration): T;
  visitFunctionDeclaration?(node: ts.FunctionDeclaration): T;
  visitVariableStatement?(node: ts.VariableStatement): T;
}
