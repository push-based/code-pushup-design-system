import { CategoryConfig, CoreConfig } from '@code-pushup/models';
import eslintPlugin, {
  eslintConfigFromNxProject,
} from '@code-pushup/eslint-plugin';

export type SsrAdoptionPluginConfig = {
  eslintrc: string;
  patterns: string[];
};
export async function ssrAdoptionPluginCoreConfig(
  opt: SsrAdoptionPluginConfig
) {
  return {
    plugins: [await eslintPlugin([opt])],
    categories: await ssrAdoptionPluginCategories(opt),
  } as const satisfies CoreConfig;
}

export async function ssrAdoptionPluginCategories(
  opt: SsrAdoptionPluginConfig
): Promise<CategoryConfig[]> {
  return [
    {
      slug: 'ssr-adoption',
      title: 'SSR Adoption',
      description: 'Audit for SSR adoption in Angular applications.',
      refs: [
        { type: 'group', plugin: 'eslint', slug: 'problems', weight: 1 },
        { type: 'group', plugin: 'eslint', slug: 'suggestions', weight: 1 },
      ],
    },
  ];
}
