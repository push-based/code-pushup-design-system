import path from 'node:path';
import postcss, { Root } from 'postcss';
import safeParser from 'postcss-safe-parser';
import { resolveFileCached } from './file.resolver';
import {
  ParsedAsset,
  ParsedComponentWithResolvedStyles,
  ParsedComponent,
} from '../types';

/**
 * Resolves the styles of a component, parsing them with PostCSS
 * and returning a partial `ParsedComponentWithResolvedStyles` that contains the AST
 * @param comp
 */
export async function resolveComponentStyles<T extends ParsedComponent>(
  comp: T
): Promise<Pick<ParsedComponentWithResolvedStyles, 'styles' | 'styleUrls'>> {
  let resolvedComponent: Pick<
    ParsedComponentWithResolvedStyles,
    'styles' | 'styleUrls'
  > = {};

  if (comp?.styles) {
    const resolvedStyles: (ParsedAsset & { ast: Root })[] = comp.styles.map(
      (styleAsset) => {
        const ast = postcss().process(styleAsset.value, {
          parser: safeParser,
        }).root;
        return { ...styleAsset, ast };
      }
    );

    if (resolvedStyles.length > 0) {
      resolvedComponent = {
        ...resolvedStyles,
        styles: resolvedStyles,
      };
    }
  }

  if (comp?.styleUrls) {
    const resolvedStyleUrls = await Promise.all(
      comp.styleUrls.map(async (styleUrlAsset) => {
        const stylePath = path.join(
          path.dirname(comp.filePath),
          styleUrlAsset.value
        );
        const styleContent = await resolveFileCached(stylePath);
        const ast = postcss().process(styleContent, {
          parser: safeParser,
        }).root;

        return { ...styleUrlAsset, ast };
      })
    );

    if (resolvedStyleUrls.length > 0) {
      resolvedComponent = {
        ...resolvedComponent,
        styleUrls: resolvedStyleUrls,
      };
    }
  }

  return resolvedComponent;
}
