import { readTextFile } from '@code-pushup/utils';
import { join } from 'node:path';

import { DsCssVarsUsage } from './models';

/**
 * matches every string, also multiline, that has an import statement importing form a path containing the passed string
 */

export const generatedStylesImportRegex =
  /@use\s+'([^']+)'(\w*\s+)?as\s+[\w,-]+;/g;
export const cssVariablesRegex = /--(?!semantic\b)([\w-]+)/g;
export const mixinsNameRegex = /@mixin\s([A-Za-z0-9]*)\s*{/g;
export const angularComponentRegex = /@Component\s*\(\s*\{/m;
export const angularComponentSelectorRegex =
  /(selector)(\s*:\s*['"])([^'"]+)(['"])/m;
export const angularComponentStyleUrlsRegex =
  /styleUrl[s?]\s*:\s*[\[?]['"]([^'"]+)['"][]?]/m;
export const angularComponentStyleUrlRegex = /styleUrl\s*:\s*['"]([^'"]+)['"]/m;
export const angularComponentInlineStylesRegex =
  /styles:\s*\[\s*`([^`]+)`\s*]/m;

export async function loadComponentStyles(
  componentContent: string,
  cmpFilePath: string,
  root = process.cwd()
): Promise<string | null> {
  const styleUrls = componentContent.match(angularComponentStyleUrlsRegex)?.[1];
  const styleUrl = componentContent.match(angularComponentStyleUrlRegex)?.[1];
  const externalStylePath = styleUrls || styleUrl || false;

  if (externalStylePath) {
    const fileName = externalStylePath.startsWith('./')
      ? externalStylePath.replace('./', '')
      : externalStylePath;
    const styleFilePath = join(root, cmpFilePath, fileName);
    return readTextFile(styleFilePath);
  }

  const inlineStyles =
    componentContent.match(angularComponentInlineStylesRegex)?.[1] || false;
  if (inlineStyles) {
    return inlineStyles;
  }

  return null;
}

export async function getGeneratedStylesMixinsUsage(
  componentStyles: string,
  variableImportPattern: string,
  uiFolderPath: string
): Promise<{
  allMixins: string[];
  usedMixins: string[];
  unusedMixins: string[];
}> {
  const allStyles = await loadGeneratedStylesFromImports(
    componentStyles,
    variableImportPattern,
    uiFolderPath
  );

  const allMixinsWrapper: string[] = [];
  const allMixinsUsagesArray = allStyles.flatMap(({ alias, content }) => {
    const allMixins = Array.from(content.matchAll(mixinsNameRegex)).map(
      (x) => x[1]
    );
    allMixins.forEach((x) => {
      allMixinsWrapper.push(x);
    });

    return allMixins.map((mixin) => ({
      mixin,
      usage: `@include ${alias}.${mixin}`,
    }));
  });

  let usedMixins: string[] = [];
  let unusedMixins: string[] = [];

  for (const { mixin, usage } of allMixinsUsagesArray) {
    if (componentStyles.includes(usage)) {
      usedMixins = [...usedMixins, mixin];
    } else {
      unusedMixins = [...unusedMixins, mixin];
    }
  }
  return { allMixins: allMixinsWrapper, usedMixins, unusedMixins };
}

export async function getGeneratedStylesCssVarsUsage(
  componentStyles: string,
  variableImportPattern: string,
  uiFolderPath: string,
  deprecatedCssVars: string[]
): Promise<DsCssVarsUsage> {
  const allStyles = await loadGeneratedStylesFromImports(
    componentStyles,
    variableImportPattern,
    uiFolderPath
  );
  const content = allStyles.map((x) => x.content).join('\n');
  const allVars = uniqueArray(
    Array.from(content.matchAll(cssVariablesRegex)).map((x) => x[0])
  );
  const allComponentCssVariables = uniqueArray(
    Array.from(componentStyles.matchAll(cssVariablesRegex)).map((x) => x[0])
  );

  let usedVars: string[] = [];
  let unusedVars: string[] = [];

  for (const cssVar of allVars) {
    if (allComponentCssVariables.includes(cssVar)) {
      usedVars = [...usedVars, cssVar];
    } else {
      if (!deprecatedCssVars.includes(cssVar)) {
        unusedVars = [...unusedVars, cssVar];
      }
    }
  }

  return { allVars, usedVars, unusedVars };
}

export async function loadGeneratedStylesFromImports(
  stylesContent: string,
  importPattern: string,
  uiFolderPath: string,
  root = process.cwd()
): Promise<
  {
    content: string;
    alias: string;
  }[]
> {
  if (!stylesContent.includes(importPattern))
    return Promise.resolve([{ content: '', alias: '' }]);
  const scssImportStatements = stylesContent.match(generatedStylesImportRegex);

  const returnData: { content: string; alias: string }[] = [];
  if (scssImportStatements) {
    for (const scssImportStatement of scssImportStatements) {
      const { path, alias } = getPathAndAlias(
        scssImportStatement,
        importPattern
      );
      returnData.push({
        content: await readTextFile(join(root, uiFolderPath, path)),
        alias,
      });
    }
  }

  return returnData;
}

function getPathAndAlias(scssImportText: string, importPattern: string) {
  if (!scssImportText.includes(importPattern)) return { path: '', alias: '' };

  // ../../generated/styles/components/bottom-nav-tabs/bottom-nav-tabs
  let path = scssImportText.split("'")[1].split("'")[0];

  const pathsToBeReplaced = [
    '../../../../../generated',
    '../../../../generated',
    '../../../generated',
    '../../generated',
  ];

  for (const x of pathsToBeReplaced) {
    path = path.replace(x, 'generated'); // remove ../../ etc from path
  }

  const pathsToBeReplacedFont = [
    '../../../../../fonts',
    '../../../../fonts',
    '../../../fonts',
    '../../fonts',
  ];

  for (const x of pathsToBeReplacedFont) {
    path = path.replace(x, 'fonts'); // remove ../../ etc from path
  }

  // ds-bottom-nav-tabs
  const alias = scssImportText.split(' as ')[1].replace(';', '');
  return { path: toScssPath(path), alias: alias };
}

function toScssPath(path: string) {
  return path.endsWith('.scss') ? path : path + '.scss';
}

export async function getDeprecatedCssVarsFromFile(
  filePath: string
): Promise<string[]> {
  return await readTextFile(filePath).then((res) => {
    return uniqueArray(
      res.split(/(\r\n|\r|\n)/).filter((x) => x.startsWith('--'))
    );
  });
}

export function uniqueArray<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function getSelectors(selectors: string[]) {
  return selectors.map(
    (selector) => new RegExp(`(?<![\\w-])${selector}(?![\\w-])`, 'g')
  );
}

export function notEmpty<T extends object>(record: T | undefined): boolean {
  return record ? Object.keys(record).length > 0 : false;
}
