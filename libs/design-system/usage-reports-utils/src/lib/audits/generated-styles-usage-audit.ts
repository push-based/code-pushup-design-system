import { AuditOutput, Issue } from '@code-pushup/models';
import { factorOf, pluralizeToken, toUnixPath } from '@code-pushup/utils';

import { ComponentStylesData, DsRunnerOptions } from '../../models';

export const dsGeneratedStylesUsageAuditSlug =
  'angular-ds-generated-styles-usage';

export async function getGeneratedStylesUsageAuditOutput(
  componentStylesData: ComponentStylesData[],
  options: DsRunnerOptions
): Promise<AuditOutput> {
  function displayValue(numberOfFiles: number): string {
    return `${pluralizeToken(
      'component',
      numberOfFiles
    )} not using generated styles`;
  }

  const auditOutput: AuditOutput = {
    slug: dsGeneratedStylesUsageAuditSlug,
    score: 1,
    value: 0,
    displayValue: displayValue(0),
  };

  const issues = await getDSComponentGeneratedStyleFileUsage(
    componentStylesData,
    options
  );

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

export function getDSComponentGeneratedStyleFileUsage(
  componentStylesData: ComponentStylesData[],
  options: { directory: string; variableImportPattern: string }
): Promise<Issue[]> {
  return Promise.all(
    componentStylesData.map(
      ({ componentFilePath, componentSelector, stylesContent }) =>
        assertComponentStylesFileUsage(
          componentFilePath,
          componentSelector,
          stylesContent,
          options
        )
    )
  );
}

export async function assertComponentStylesFileUsage(
  file: string,
  selector: string,
  stylesContent: string,
  options: { directory: string; variableImportPattern: string }
): Promise<Issue> {
  // informative issue (component styles are OK)
  const issue = { source: { file: toUnixPath(file) } } satisfies Pick<
    Issue,
    'source'
  >;

  // no usage of generated styles
  if (!stylesContent.includes(options.variableImportPattern)) {
    return {
      ...issue,
      severity: 'error',
      message: errorMessageNoUsageOfVariables(file, selector),
    } satisfies Issue;
  }

  // return informative Issue
  return {
    ...issue,
    severity: 'info',
    message: infoMessage(file, selector),
  } satisfies Issue;
}

function filterSeverityError(issue: Issue): issue is Issue {
  return issue.severity === 'error';
}

export function infoMessage(filePath: string, selector: string) {
  return `<b>${selector}</b> uses generated tokens.`;
}

export function errorMessageNoUsageOfVariables(
  filePath: string,
  selector: string
) {
  return `<b>${selector}</b> does not use generated tokens.`;
}
