import { Audit, CategoryRef } from '@code-pushup/models';
import { slugify } from '@code-pushup/utils';
import { ANGULAR_DS_COVERAGE_PLUGIN_SLUG } from './constants';
import {
  getCompCoverageAuditDescription,
  getCompCoverageAuditSlug,
  getCompCoverageAuditTitle,
} from './runner/audits/ds-coverage/utils';
import { ComponentReplacement } from './runner/audits/ds-coverage/types';

export function getAudits(
  componentReplacements: ComponentReplacement[]
): Audit[] {
  return componentReplacements.map((comp) => ({
    slug: getCompCoverageAuditSlug(comp),
    title: getCompCoverageAuditTitle(comp),
    description: getCompCoverageAuditDescription(comp),
  }));
}

export function getAngularDsCoverageCategoryRefs(
  componentReplacements: ComponentReplacement[]
): CategoryRef[] {
  return getAudits(componentReplacements).map(({ slug }) => ({
    slug,
    plugin: ANGULAR_DS_COVERAGE_PLUGIN_SLUG,
    type: 'audit',
    weight: 1,
  }));
}
