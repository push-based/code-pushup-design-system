import { crawlFileSystem, readTextFile } from '@code-pushup/utils';

import { ComponentStylesData, DsRunnerOptions } from '../../models';
import {
  angularComponentRegex,
  angularComponentSelectorRegex,
  loadComponentStyles,
} from '../../utils';

export function getDSComponentStylesData(
  options: DsRunnerOptions
): Promise<ComponentStylesData[]> {
  const { directory } = options;

  return crawlFileSystem({
    directory,
    // pattern: /.(ts)$/,
    pattern: /^(?!.*(\.spec\.ts|\.test\.ts)$).*\.ts$/,
    fileTransform: async (filePath: string) => {
      const componentContent = await readTextFile(filePath);
      // Only process files with Angular components inside. Filter out later.
      const isComponentFile = Boolean(
        componentContent.match(angularComponentRegex)
      );
      if (!isComponentFile) {
        return false;
      }
      const selector =
        componentContent.match(angularComponentSelectorRegex)?.[3] || false;
      if (!selector || selector.includes('demo')) {
        // skips selectors with demo as they are used for tests only
        return false;
      }

      // Convert
      // packages\\design-system\\ui\\sports\\score-lookup\\src\\score-lookup.component.ts
      // -> packages/design-system/ui/sports/score-lookup/src
      const cmpFilePath = replaceAll(filePath, '\\', '/')
        .split('/')
        .slice(0, -1)
        .join('/');

      const componentStyles = await loadComponentStyles(
        componentContent,
        cmpFilePath
      );

      if (componentStyles === null) {
        return false;
      }

      return {
        stylesContent: componentStyles,
        componentFilePath: cmpFilePath,
        componentSelector: selector,
      };
    },
  }).then((arr) => arr.filter((v): v is ComponentStylesData => !!v));
}

function replaceAll(str: string, find: string, replace: string) {
  return str.split(find).join(replace);
}
