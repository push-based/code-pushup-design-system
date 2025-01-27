import { CoreConfig } from '@code-pushup/models';
import dsReportPlugin, {
  AngularDsCoveragePluginConfig,
  getAngularDsCoverageCategoryRefs,
} from '../plugins/ds-coverage/index';

export async function angularDsCoverageCoreConfig({
  directory,
  dsComponents,
}: AngularDsCoveragePluginConfig) {
  return {
    plugins: [
      dsReportPlugin({
        directory,
        dsComponents,
      }),
    ],
    categories: [
      {
        slug: 'design-system-coverage',
        title: 'Design System Coverage',
        description: 'Usage of design system components',
        refs: getAngularDsCoverageCategoryRefs(dsComponents),
      },
    ],
  } satisfies CoreConfig;
}
