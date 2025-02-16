import { CategoryConfig, CategoryRef, CoreConfig } from '@code-pushup/models';
import dsQualityPlugin, {
  DS_QUALITY_PLUGIN_SLUG,
  DsQualityPluginConfig,
} from './lib/ds-quality.plugin';
import { getStyleTokenAudits } from './lib/runner/audits/style-tokens/utils';
import { getStyleMixinAudits } from './lib/runner/audits/style-mixins/utils';
import { DeprecationDefinition } from './lib/runner/audits/types';

export async function dsQualityPluginCoreConfig(opt: DsQualityPluginConfig) {
  return {
    plugins: [dsQualityPlugin(opt)],
    categories: await dsQualityPluginCategories(opt),
  } as const satisfies CoreConfig;
}

export async function dsQualityPluginCategories({
  deprecatedTokens,
  deprecatedMixins,
}: Pick<
  DsQualityPluginConfig,
  'deprecatedTokens' | 'deprecatedMixins'
>): Promise<CategoryConfig[]> {
  return [
    {
      slug: 'design-system-quality',
      title: 'Design System Quality',
      description: 'Usage of deprecated design system tokens and mixins',
      refs: [
        ...getStyleTokenCategoryRefs([...deprecatedTokens]),
        ...getStyleMixinCategoryRefs([...deprecatedMixins]),
      ],
    },
  ];
}

export function getStyleTokenCategoryRefs(
  tokenReplacements: DeprecationDefinition[]
): CategoryRef[] {
  return getStyleTokenAudits(tokenReplacements).map(({ slug }) => ({
    slug,
    plugin: DS_QUALITY_PLUGIN_SLUG,
    type: 'audit',
    weight: 1,
  }));
}

export function getStyleMixinCategoryRefs(
  tokenReplacements: DeprecationDefinition[]
): CategoryRef[] {
  return getStyleMixinAudits(tokenReplacements).map(({ slug }) => ({
    slug,
    plugin: DS_QUALITY_PLUGIN_SLUG,
    type: 'audit',
    weight: 1,
  }));
}
