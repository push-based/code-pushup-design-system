import { AuditOutputs, CategoryRef, PluginConfig } from '@code-pushup/models';

import { DsAdoptionPluginOptions } from '../../models';
import {
  dsComponentsHintAuditSlug,
  getClassToBeReplacedWithDsComponentAuditOutput,
} from '../audits/ds-components-hint-audit';
import {
  dsTokensOverrideAuditSlug,
  getTokensOverrideAuditOutput,
} from '../audits/ds-components-tokens-override-audit';
import {
  dsComponentsUsageAuditSlug,
  getDsComponentsUsageAuditOutput,
} from '../audits/ds-components-usage-audit';

export const auditsMap = {
  [dsComponentsUsageAuditSlug]: {
    slug: dsComponentsUsageAuditSlug,
    title: 'DS Components Usage Audit',
    description: 'Checks usage of DS Components',
  },
  [dsComponentsHintAuditSlug]: {
    slug: dsComponentsHintAuditSlug,
    title: 'DS Components Hints Audit',
    description: 'Gives hints on what classes to replace with DS Components',
  },
  [dsTokensOverrideAuditSlug]: {
    slug: dsTokensOverrideAuditSlug,
    title: 'DS Component Tokens Overrides Audit',
    description: 'Checks manual overriding of DS components tokens',
  },
};

export const audits = Object.values(auditsMap);
const DS_PLUGIN_SLUG = 'design-system';

export const recommendedRefs = () =>
  Object.values(auditsMap).map(({ slug }) => ({
    type: 'audit',
    plugin: DS_PLUGIN_SLUG,
    slug,
    weight: 1,
  })) satisfies CategoryRef[];

export function create(options: DsAdoptionPluginOptions): PluginConfig {
  return {
    slug: DS_PLUGIN_SLUG,
    title: 'Design System Adoption Report',
    icon: 'javascript',
    description:
      'A plugin to measure adoption of Design System components in project.',
    runner: () => runnerFunction(options),
    audits,
  };
}

export async function runnerFunction(
  options: DsAdoptionPluginOptions
): Promise<AuditOutputs> {
  const dsComponentsUsage = await getDsComponentsUsageAuditOutput(
    options.directory
  );
  const dsComponentsUsageHints =
    await getClassToBeReplacedWithDsComponentAuditOutput(options);
  const dsTokenOverrides = await getTokensOverrideAuditOutput(
    options.directory
  );
  return [dsComponentsUsage, dsComponentsUsageHints, dsTokenOverrides];
}

export default create;
