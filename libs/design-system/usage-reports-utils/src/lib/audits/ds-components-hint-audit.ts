import { AuditOutput, Issue } from '@code-pushup/models';
import {
  crawlFileSystem,
  pluralizeToken,
  readTextFile,
} from '@code-pushup/utils';

import {
  DsAdoptionPluginOptions,
  DsComponentReplacementConfig,
  ReplacementGroup,
} from '../../models';
import { findNodesByCssClass } from '../../utils/find-nodes-by-css-class';
import { ClassToDsComponentMap } from '../plugins/class-to-ds-component-map';

export const dsComponentsHintAuditSlug = 'ds-components-hint';

export async function getClassToBeReplacedWithDsComponentAuditOutput(
  options: DsAdoptionPluginOptions
): Promise<AuditOutput> {
  const directory = options.directory;
  const replacementsConfigs = mergeReplacementConfigs(
    ClassToDsComponentMap,
    options.replacements ?? []
  );
  const data: ReplacementGroup[] = await crawlFileSystem({
    directory,
    pattern: '^.*.html$',
    fileTransform: async (filePath: string) => {
      return await getClassesToReplace(filePath, replacementsConfigs);
    },
  });

  const auditOutput: AuditOutput = {
    slug: dsComponentsHintAuditSlug,
    score: 1,
    value: 0,
    displayValue: displayValue(0),
  };

  const issues = toIssues(data);

  if (issues.length === 0) {
    return auditOutput;
  }
  // todo for each css class in DsComponentReplacementConfig create a audi

  return {
    ...auditOutput,
    score: 0,
    value: issues.length,
    displayValue: displayValue(issues.length),
    details: {
      issues,
    },
  } satisfies AuditOutput;
}

function displayValue(numberOfFiles: number): string {
  return `${pluralizeToken(
    'classes',
    numberOfFiles
  )} should be replaced with Design System components`;
}

export function toIssues(data: ReplacementGroup[]): Issue[] {
  return data.flatMap((group) => {
    return group.replacements.map((replacement) => {
      return {
        severity: 'error',
        message: `Replace **${replacement.cssClass}** with component **${replacement.componentName}**. [Storybook](${replacement.storybookLink})`,
        source: {
          file: group.filePath,
          position: {
            startLine: replacement.lineOfCode,
          },
        },
      };
    });
  });
}

export async function getClassesToReplace(
  filePath: string,
  replacementsConfigs: DsComponentReplacementConfig[]
): Promise<ReplacementGroup> {
  const componentContent = await readTextFile(filePath);
  const group: ReplacementGroup = { filePath, replacements: [] };

  replacementsConfigs.forEach((replacementsConfig) => {
    replacementsConfig.matchingCssClasses.forEach((cssClass) => {
      const nodes = findNodesByCssClass(componentContent, [cssClass]);
      if (nodes.length > 0) {
        const matches = group.replacements;

        if (matches) {
          nodes.forEach((node) => {
            matches.push({
              cssClass,
              lineOfCode: node.lineOfCode,
              componentName: replacementsConfig.componentName,
              storybookLink: replacementsConfig.storybookLink,
            });
          });
        }
      }
    });
  });
  return group;
}

function mergeReplacementConfigs(
  source1: DsComponentReplacementConfig[],
  source2: DsComponentReplacementConfig[]
): DsComponentReplacementConfig[] {
  return [...source1, ...source2];
}
