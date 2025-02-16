import { Audit } from '@code-pushup/models';
import { slugify } from '@code-pushup/utils';
import { DeprecationDefinition } from '../types';

export function getStyleMixinAuditSlug(deprecatedEntity: string): string {
  return slugify(`deprecated-mixin-${slugify(deprecatedEntity)}`);
}

export function getStyleMixinAudits(
  deprecatedMixins: DeprecationDefinition[]
): Audit[] {
  return deprecatedMixins.map(({ deprecatedEntity }) => ({
    slug: getStyleMixinAuditSlug(deprecatedEntity),
    title: `Deprecated mixin ${deprecatedEntity} used`,
    description: `Deprecated mixin ${deprecatedEntity} used in the component styles.`,
  }));
}

