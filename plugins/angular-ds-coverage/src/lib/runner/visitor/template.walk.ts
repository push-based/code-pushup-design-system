import { TmplAstNode, TmplAstVisitor } from '@angular/compiler';
import { CssAstVisitor } from './stylesheet.visitor';
import { Root } from 'postcss';

export function visitEachTmplChild<T>(
  nodes: TmplAstNode[],
  visitor: TmplAstVisitor<T>
) {
  for (const node of nodes) {
    node.visit(visitor);
  }
}

export function visitEachStyleNode<T>(root: Root, visitor: CssAstVisitor<T>) {
  for (const node of root.nodes) {
    switch (node.type) {
      case 'rule':
        visitor?.visitRule?.(node);
        break;
      case 'atrule':
        visitor?.visitAtRule?.(node);
        break;
      case 'decl':
        visitor?.visitDeclaration?.(node);
        break;
      case 'comment':
        visitor?.visitComment?.(node);
        break;
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }
}
