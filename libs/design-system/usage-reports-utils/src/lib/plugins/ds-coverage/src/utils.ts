import { Audit, CategoryRef } from '@code-pushup/models';
import { slugify } from '@code-pushup/utils';
import { ComponentReplacement } from './types';
import { ANGULAR_DS_COVERAGE_PLUGIN_SLUG } from './constants';

export function getAudits(
  componentReplacements: ComponentReplacement[]
): Audit[] {
  return componentReplacements.map(({ componentName }) => ({
    slug: slugify(componentName),
    title: componentName,
    description: `Check usage of ${componentName} in the project`,
  }));
}

export function getAngularDsCoverageCategoryRefs(
  componentReplacements: ComponentReplacement[]
): CategoryRef[] {
  return componentReplacements.map(({ componentName }) => ({
    slug: slugify(componentName),
    plugin: ANGULAR_DS_COVERAGE_PLUGIN_SLUG,
    type: 'audit',
    weight: 1,
  }));
}
