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
    console.log('visitMethodName:', visitMethodName)
    visitor[visitMethodName as keyof CssAstVisitor]?.(node as any);
  });
}
