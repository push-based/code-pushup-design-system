import { AuditOutputs, CategoryRef, PluginConfig } from '@code-pushup/models';

import { DsRunnerOptions, DsStylesAnalysisPluginOptions } from '../../models';
import {
  getDeprecatedCssVarsFromFile,
  getGeneratedStylesCssVarsUsage,
} from '../../utils';
import {
  dsCssVarsUsageAuditSlug,
  getCssVarsUsageAuditOutput,
} from '../audits/css-vars-usage-audit';
import {
  dsDeprecatedCssVarsAuditSlug,
  getDeprecatedCssVarsAuditOutput,
} from '../audits/deprecated-css-vars-audit';
import {
  dsGeneratedStylesUsageAuditSlug,
  getGeneratedStylesUsageAuditOutput,
} from '../audits/generated-styles-usage-audit';
import {
  dsMixinsUsageAuditSlug,
  getMixinUsageAuditOutput,
} from '../audits/mixins-usage-audit';
import { getDSComponentStylesData } from './get-component-styles-data';

export const pluginSlug = 'angular-ds';

export const auditsMap = {
  [dsGeneratedStylesUsageAuditSlug]: {
    slug: dsGeneratedStylesUsageAuditSlug,
    title: 'DS Components Generated Styles Usage Audit',
    description: 'Check usage of generated style files in DS Components',
  },
  [dsMixinsUsageAuditSlug]: {
    slug: dsMixinsUsageAuditSlug,
    title: 'DS Components @mixin-s Usage Audit',
    description: 'Check usage of generated mixins in DS Components styles',
  },
  [dsCssVarsUsageAuditSlug]: {
    slug: dsCssVarsUsageAuditSlug,
    title: 'DS Components CSS Variables Usage Audit',
    description: 'Check usage of css variables in DS Components styles',
  },
  [dsDeprecatedCssVarsAuditSlug]: {
    slug: dsDeprecatedCssVarsAuditSlug,
    title: 'DS Deprecated Css Vars Audit',
    description:
      'Check usage of deprecated css variables in DS Component styles',
  },
};

export const audits = Object.values(auditsMap);

export const recommendedRefs: CategoryRef[] = Object.values(auditsMap).map(
  ({ slug }) => ({
    type: 'audit',
    plugin: pluginSlug,
    slug,
    weight: 1,
  })
);

export function create(options: DsStylesAnalysisPluginOptions): PluginConfig {
  return {
    slug: pluginSlug,
    title: 'Design System',
    icon: 'javascript',
    description:
      'A plugin to measure and assert usage of styles in a Angular project.',
    runner: () => runnerFunction(options),
    audits,
  };
}

export async function runnerFunction(
  options: DsRunnerOptions
): Promise<AuditOutputs> {
  // gather all component styles in order to be reused later by multiple audits
  const componentStylesData = await getDSComponentStylesData(options);

  // get all deprecated vars in order to reuse them in multiple audits
  const deprecatedCssVars = await getDeprecatedCssVarsFromFile(
    options.deprecatedCssVarsFilePath
  );

  // get audit output for generated styles usage
  const styleFileUsageAuditOutput = await getGeneratedStylesUsageAuditOutput(
    componentStylesData,
    options
  );

  // filter only the components that use the generated styles. It will be used to check if they use all the provided mixins or not.
  const successfulStyleUsages = styleFileUsageAuditOutput.details?.issues
    ?.filter((x) => x.severity === 'info')
    .map((x) => x.message);

  const componentStylesDataWithGeneratedStyles = componentStylesData.filter(
    (x) => {
      return successfulStyleUsages?.find((usage) =>
        usage.includes(x.componentSelector)
      );
    }
  );

  const mixinUsageAuditOutput = await getMixinUsageAuditOutput(
    componentStylesDataWithGeneratedStyles,
    options
  );

  const cssVarsUsage = await Promise.all(
    componentStylesData.map(({ componentSelector, stylesContent }) =>
      getGeneratedStylesCssVarsUsage(
        stylesContent,
        options.variableImportPattern,
        options.directory,
        deprecatedCssVars
      ).then((result) => ({
        componentSelector,
        result,
      }))
    )
  );

  const cssVariablesUsageAuditOutput = await getCssVarsUsageAuditOutput(
    componentStylesDataWithGeneratedStyles,
    cssVarsUsage
  );
  const deprecatedCssVariablesUsageAuditOutput =
    await getDeprecatedCssVarsAuditOutput(
      componentStylesDataWithGeneratedStyles,
      cssVarsUsage,
      deprecatedCssVars,
      options.deprecatedCssVarsFilePath
    );

  return [
    styleFileUsageAuditOutput,
    mixinUsageAuditOutput,
    cssVariablesUsageAuditOutput,
    deprecatedCssVariablesUsageAuditOutput,
  ];
}

export default create;
