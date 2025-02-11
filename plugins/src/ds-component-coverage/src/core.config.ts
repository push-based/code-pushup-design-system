import { CategoryConfig, CoreConfig } from '@code-pushup/models';
import angularDsCoveragePlugin, {
  AngularDsCoveragePluginConfig,
} from './lib/ds-component-coverage.plugin';
import { getAngularDsCoverageCategoryRefs } from './lib/utils';

export async function angularDsCoveragePluginCoreConfig({
  directory,
  dsComponents,
}: AngularDsCoveragePluginConfig) {
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
}: Pick<AngularDsCoveragePluginConfig, 'dsComponents'>): Promise<
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
