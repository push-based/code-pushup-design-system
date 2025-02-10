import { Root } from 'postcss';
import { CssAstVisitor } from './stylesheet.visitor';

/**
 * Single function that traverses the AST, calling
 * specialized visitor methods as it encounters each node type.
 */
export function visitEachChild<T>(root: Root, visitor: CssAstVisitor<T>) {
  visitor.visitRoot?.(root);

  root.walk((node) => {
    // node.type can be 'rule', 'atrule', 'decl', 'comment', etc.
    // Dispatch to your visitor if desired "visitRule", "visitAtRule", etc.
    const visitMethodName = `visit${
      node.type[0].toUpperCase() + node.type.slice(1)
    }`;
    visitor[visitMethodName as keyof CssAstVisitor]?.(node as any);
  });
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
        throw new Error('visit declaration not implemented')
       // visitor?.visitDeclaration?.(node);
      case 'comment':
        visitor?.visitComment?.(node);
        break;
      default:
        throw new Error(`Unknown node type: ${(node as Root).type}`);
    }
  }
}
