import ts from 'typescript';
import { getDecorators, isDecorator } from './utils';

/**
 * Visits all decorators in a given class.
 */
export function visitAngularDecorators(
  node: ts.Node,
  visitor: (decorator: ts.Decorator) => void
) {
  const decorators = getDecorators(node);
  if (!decorators?.length) return;

  decorators.forEach((decorator: ts.Decorator) => {
    if (!isDecorator(decorator)) return;
    visitor(decorator);
  });
}

// 👀 visit every decorator
// ✔ in visitor use `isDecorator`or `isComponentDecorator`

/**
 * Visits all properties inside a Angular decorator. e.g. @Component()
 */
export function visitAngularDecoratorProperties(
  decorator: ts.Decorator,
  visitor: (node: ts.PropertyAssignment & ts.Identifier) => void
) {
  const args = decorator.expression.arguments;
  if (!args?.length || !ts.isObjectLiteralExpression(args[0])) {
    return;
  }

  args[0].properties.forEach((prop: ts.ObjectLiteralElementLike) => {
    if (!ts.isPropertyAssignment(prop) || !ts.isIdentifier(prop.name)) return;

    visitor(prop);
  });
}
