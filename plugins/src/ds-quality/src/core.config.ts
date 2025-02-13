import { CategoryConfig, CoreConfig } from '@code-pushup/models';
import dsQualityPlugin, {
  DsQualityPluginConfig,
} from './lib/ds-quality.plugin';
import { getStyleTokenCategoryRefs } from './lib/runner/audits/style-tokens/utils';

export async function dsQualityPluginCoreConfig(opt: DsQualityPluginConfig) {
  return {
    plugins: [dsQualityPlugin(opt)],
    categories: await dsQualityPluginCategories(opt),
  } as const satisfies CoreConfig;
}

export async function dsQualityPluginCategories({
                                                  deprecatedTokens
                                                }: Pick<DsQualityPluginConfig, 'deprecatedTokens'>): Promise<CategoryConfig[]> {
  return [
    {
      slug: 'design-system-quality',
      title: 'Design System Quality',
      description: 'Usage of deprecated design system tokens and mixins',
      refs: getStyleTokenCategoryRefs([...deprecatedTokens]),
    },
  ];
}
