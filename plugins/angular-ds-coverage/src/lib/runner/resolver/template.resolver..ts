import { parseTemplate } from '@angular/compiler';
import path from 'node:path';
import { resolveFileCached } from './file.resolver';
import {
  ParsedDecoratorConfigWithResolvedTemplate,
  ParsedDecoratorConfig,
} from '../types';

/**
 * Resolves the template of a component, parsing it with Angular's compiler.
 * Returns a partial `ParsedComponentWithResolvedTemplate` that contains the AST
 * @param comp
 */
export async function resolveComponentTemplate<T extends ParsedDecoratorConfig>(
  comp: T
): Promise<
  Pick<ParsedDecoratorConfigWithResolvedTemplate, 'templateUrl' | 'template'>
> {
  let resolvedComponent: Pick<
    ParsedDecoratorConfigWithResolvedTemplate,
    'templateUrl' | 'template'
  > = {};
  if (comp?.template) {
    resolvedComponent = {
      template: {
        ...comp.template,
        ast: parseTemplate(comp.template.value, comp.filePath),
      },
    };
  }

  if (comp?.templateUrl) {
    const template = await resolveFileCached(
      path.join(path.dirname(comp.filePath), comp.templateUrl.value)
    );

    const ast = parseTemplate(template, comp.templateUrl.value);
    if (ast.errors != null) {
      console.error('Error parsing template:', ast.errors);
    }
    resolvedComponent = {
      templateUrl: {
        ...comp.templateUrl,
        ast,
      },
    };
  }

  return resolvedComponent;
}
