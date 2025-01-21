import path from 'node:path';
import angularDsPlugin, {
  recommendedRefs as angularDsRecommendedRefs,
} from '../plugins/ds-styles-analysis.plugin';

// ----------------------------------------
// moved from @design-system/token-path-config-utils for simplicity

export type TokenPathType = {
  uiComponentsPath: string;
  cssTokensPath: string;
  jsonTokensPath: string;
  exportPrefix: string;
  reviewerIds?: number[];
};
export enum TokenPathName {
  DesignSystem = 'design-system',
  Sports = 'sports',
  Casino = 'casino',
}

const tokenPathConfig: Record<TokenPathName, TokenPathType> = {
  [TokenPathName.DesignSystem]: {
    uiComponentsPath: 'packages/design-system/ui',
    cssTokensPath: 'packages/design-system/ui/generated',
    jsonTokensPath: 'packages/design-system/tokens-assets/generated',
    exportPrefix: 'ds',
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    reviewerIds: [
      80, // stefan.gart
      1240, // jtomaszewska
      1273, // Igor.Radovanovic
      2186, // SaiKumar.Duggana
      2722, // Santoshi.Dandi
      // 2767, // Enea.Jahollari
      // 3312, // Markus.Nissl
      3330, // Madhav.Bhushan
      // 3460, // Julia.Rapczynska,
    ],
  },
  [TokenPathName.Sports]: {
    uiComponentsPath: 'packages/sports/libs/ui',
    cssTokensPath: 'packages/sports/libs/ui/generated',
    jsonTokensPath: 'packages/sports/tokens-assets/generated',
    exportPrefix: 'sp',
  },
  [TokenPathName.Casino]: {
    uiComponentsPath: 'packages/casino/ui-libs',
    cssTokensPath: 'packages/casino/ui-libs/generated',
    jsonTokensPath: 'packages/casino/tokens-assets/generated',
    exportPrefix: 'cs',
  },
};
export function getTokenPaths(name: TokenPathName) {
  return tokenPathConfig[name];
}

// ----------------------------------------

export const dsStylesUsageReport = async () => ({
  plugins: [
    angularDsPlugin({
      directory: './packages/design-system/ui',
      variableImportPattern: "@use '../..",
      deprecatedCssVarsFilePath: path.join(
        getTokenPaths(TokenPathName.DesignSystem).cssTokensPath,
        'deprecated.txt'
      ),
    }),
  ],
  categories: [
    {
      slug: 'design-system',
      title: 'Design System',
      refs: [...angularDsRecommendedRefs],
    },
  ],
});
