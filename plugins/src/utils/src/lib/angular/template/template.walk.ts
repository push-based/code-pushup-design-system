import { TmplAstNode, TmplAstRecursiveVisitor } from '@angular/compiler';

export function visitEachTmplChild(nodes: TmplAstNode[], visitor: TmplAstRecursiveVisitor) {
  nodes.forEach((node) => node.visit(visitor));
}
