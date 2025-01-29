import { ParsedComponent, ResolvedComponent } from '../types';
import { resolveComponentTemplate } from './template.resolver.';
import { resolveComponentStyles } from './styles.resolver';
import { TmplAstElement } from '@angular/compiler';
import { Issue } from '@code-pushup/models';

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

/**
 * Converts matching `TmplAstElement's` from a visitor into Issues.
 */
export function mapTmplAstElementsToIssues(
  matchingElements: TmplAstElement[],
  filePath: string,
  targetClass: string
): Issue[] {
  return matchingElements.map((element) => ({
    message: `Element \`<${element.name}>\` contains the targeted class '${targetClass}'.`,
    severity: 'warning',
    source: {
      file: filePath,
      position: {
        startLine: element.sourceSpan.start.line + 1,
      },
    },
  }));
}
