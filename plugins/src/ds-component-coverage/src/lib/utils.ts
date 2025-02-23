import { Audit, CategoryRef } from '@code-pushup/models';
import { ANGULAR_DS_USAGE_PLUGIN_SLUG } from './constants';
import { getCompUsageAudits } from './runner/audits/ds-coverage/utils';
import { ComponentReplacement } from './runner/audits/ds-coverage/types';

export function getAudits(
  componentReplacements: ComponentReplacement[]
): Audit[] {
  return [...getCompUsageAudits(componentReplacements)];
}

export function getAngularDsUsageCategoryRefs(
  componentReplacements: ComponentReplacement[]
): CategoryRef[] {
  return getAudits(componentReplacements).map(({ slug }) => ({
    slug,
    plugin: ANGULAR_DS_USAGE_PLUGIN_SLUG,
    type: 'audit',
    weight: 1,
  }));
}
