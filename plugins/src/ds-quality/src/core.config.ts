import { CategoryConfig, CategoryRef, CoreConfig } from '@code-pushup/models';
import dsQualityPlugin, {
  DsQualityPluginConfig,
} from './lib/ds-quality.plugin';
import { getDeprecatedVariableAudits } from './lib/runner/audits/variable-usage/utils';
import { getDeprecatedMixinAudits } from './lib/runner/audits/mixin-usage/utils';
import { DeprecationDefinition } from './lib/runner/audits/types';
import { DS_QUALITY_PLUGIN_SLUG } from './lib/constants';

export async function dsQualityPluginCoreConfig(opt: DsQualityPluginConfig) {
  return {
    plugins: [dsQualityPlugin(opt)],
    categories: await dsQualityPluginCategories(opt),
  } as const satisfies CoreConfig;
}

export async function dsQualityPluginCategories({
  deprecatedVariables = [],
  deprecatedMixins = [],
}: Pick<
  DsQualityPluginConfig,
  'deprecatedVariables' | 'deprecatedMixins'
>): Promise<CategoryConfig[]> {
  const variableRefs = getStyleVariableCategoryRefs([...deprecatedVariables]);
  const mixinsRefs = getStyleMixinCategoryRefs([...deprecatedMixins]);
  return [
    ...(variableRefs.length > 0
      ? [
          {
            slug: 'design-system-token-usage',
            title: 'Design System Variable Usage',
            description: 'Usage of deprecated design system variable',
            refs: variableRefs,
          },
        ]
      : []),
    ...(mixinsRefs.length > 0
      ? [
          {
            slug: 'design-system-mixin-usage',
            title: 'Design System Mixin Usage',
            description: 'Usage of deprecated design system mixins',
            refs: mixinsRefs,
          },
        ]
      : []),
  ];
}

export function getStyleVariableCategoryRefs(
  tokenReplacements: DeprecationDefinition[]
): CategoryRef[] {
  return getDeprecatedVariableAudits(tokenReplacements).map(({ slug }) => ({
    slug,
    plugin: DS_QUALITY_PLUGIN_SLUG,
    type: 'audit',
    weight: 1,
  }));
}

export function getStyleMixinCategoryRefs(
  tokenReplacements: DeprecationDefinition[]
): CategoryRef[] {
  return getDeprecatedMixinAudits(tokenReplacements).map(({ slug }) => ({
    slug,
    plugin: DS_QUALITY_PLUGIN_SLUG,
    type: 'audit',
    weight: 1,
  }));
}
