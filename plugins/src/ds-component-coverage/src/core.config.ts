import { CategoryConfig, CoreConfig } from '@code-pushup/models';
import angularDsCoveragePlugin, {
  DsComponentCoveragePluginConfig,
} from './lib/ds-component-coverage.plugin';
import { getAngularDsCoverageCategoryRefs } from './lib/utils';

export async function dsComponentCoveragePluginCoreConfig({
  directory,
  dsComponents,
}: DsComponentCoveragePluginConfig) {
  return {
    plugins: [
      angularDsCoveragePlugin({
        directory,
        dsComponents,
      }),
    ],
    categories: await angularDsCoveragePluginCategories({ dsComponents }),
  } as const satisfies CoreConfig;
}

export async function angularDsCoveragePluginCategories({
  dsComponents,
}: Pick<DsComponentCoveragePluginConfig, 'dsComponents'>): Promise<
  CategoryConfig[]
> {
  return [
    {
      slug: 'design-system-coverage',
      title: 'Design System Coverage',
      description: 'Usage of design system components',
      refs: getAngularDsCoverageCategoryRefs(dsComponents),
    },
  ];
}
