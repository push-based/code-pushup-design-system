import { AuditOutput, Issue } from '@code-pushup/models';
import { factorOf, pluralizeToken, toUnixPath } from '@code-pushup/utils';

import { ComponentStylesData, DsRunnerOptions } from '../../models';
import { getGeneratedStylesMixinsUsage } from '../../utils';

export const dsMixinsUsageAuditSlug = 'angular-ds-mixins-usage';

export async function getMixinUsageAuditOutput(
  componentStylesData: ComponentStylesData[],
  options: DsRunnerOptions
): Promise<AuditOutput> {
  function displayValue(numberOfFiles: number): string {
    return `${pluralizeToken(
      'component',
      numberOfFiles
    )} not using all the mixins`;
  }

  const auditOutput: AuditOutput = {
    slug: dsMixinsUsageAuditSlug,
    score: 1,
    value: 0,
    displayValue: displayValue(0),
  };

  const issues = await getDSComponentMixinsUsage(componentStylesData, options);

  // early exit if no issues
  if (issues.length === 0) {
    return auditOutput;
  }

  const errorCount = issues.filter(filterSeverityError).length;
  return {
    ...auditOutput,
    score: factorOf(issues, filterSeverityError),
    value: errorCount,
    displayValue: displayValue(errorCount),
    details: { issues },
  } satisfies AuditOutput;
}

export function getDSComponentMixinsUsage(
  componentStylesData: ComponentStylesData[],
  options: { directory: string; variableImportPattern: string }
): Promise<Issue[]> {
  return Promise.all(
    componentStylesData.map(
      ({ componentFilePath, componentSelector, stylesContent }) =>
        assertComponentMixinsUsage(
          componentFilePath,
          componentSelector,
          stylesContent,
          options
        )
    )
  );
}

export async function assertComponentMixinsUsage(
  file: string,
  selector: string,
  stylesContent: string,
  {
    directory,
    variableImportPattern,
  }: { directory: string; variableImportPattern: string }
): Promise<Issue> {
  // informative issue (component styles are OK)
  const issue = { source: { file: toUnixPath(file) } } satisfies Pick<
    Issue,
    'source'
  >;

  const result = await getGeneratedStylesMixinsUsage(
    stylesContent,
    variableImportPattern,
    directory
  );

  // missing variables in styles
  if (result.unusedMixins.length) {
    return {
      ...issue,
      severity: 'error',
      message: `<b>${selector}</b> - Unused mixins: ${result.unusedMixins
        .map((x) => `<code style="color:red">${x}</code>`)
        .join(', ')}`,
    } satisfies Issue;
  }

  // return informative Issue
  return {
    ...issue,
    severity: 'info',
    message: `<b>${selector}</b> - Used mixins: ${result.usedMixins
      .map((x) => `<code style="color:green">${x}</code>`)
      .join(', ')}`,
  } satisfies Issue;
}

function filterSeverityError(issue: Issue): issue is Issue {
  return issue.severity === 'error';
}
