import { ParsedComponent, ResolvedComponent } from '../types';
import { resolveComponentStyles } from './styles.resolver';
import { resolveComponentTemplate } from './template.resolver.';

/**
 * Resolves the template and styles of a component.
 * It returns a `ResolvedComponent` with the template, the templates style tags and styles, inline or as file reference,
 * and of all of it their ASTs.
 *
 * @param comp
 * @param resolveAssets
 */
export async function resolveComponentFiles(
  comp: ParsedComponent,
  resolveAssets: ('template-assets' | 'styles-assets')[] = [
    'template-assets',
    'styles-assets',
  ]
): Promise<ResolvedComponent> {
  let baseComponent = comp as ResolvedComponent;

  for (const key of resolveAssets) {
    switch (key) {
      case 'template-assets': {
        const resolvedTemplate = await resolveComponentTemplate(comp);
        baseComponent = { ...baseComponent, ...resolvedTemplate };
        break;
      }
      case 'styles-assets': {
        const resolvedStyles = await resolveComponentStyles(comp);
        baseComponent = { ...baseComponent, ...resolvedStyles };
        break;
      }
      default:
        throw new Error(`Invalid asset type: ${key}`);
    }
  }

  return baseComponent;
}
