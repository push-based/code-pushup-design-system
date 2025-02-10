import { TmplAstNode, TmplAstRecursiveVisitor } from '@angular/compiler';

export function visitEachTmplChild<T>(
  nodes: TmplAstNode[],
  visitor: TmplAstRecursiveVisitor
) {
  nodes.forEach((node) => node.visit(visitor));
}
