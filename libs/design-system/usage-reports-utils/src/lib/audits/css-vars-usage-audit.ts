import { AuditOutput, Issue } from '@code-pushup/models';
import { factorOf, pluralizeToken, toUnixPath } from '@code-pushup/utils';

import { ComponentStylesData, DsCssVarsUsage } from '../../models';

export const dsCssVarsUsageAuditSlug = 'angular-ds-css-vars-usage';

export async function getCssVarsUsageAuditOutput(
  componentStylesData: ComponentStylesData[],
  cssVarsUsage: { componentSelector: string; result: DsCssVarsUsage }[]
): Promise<AuditOutput> {
  const issues = await Promise.all(
    componentStylesData.map(({ componentFilePath, componentSelector }) => {
      const componentVarsUsage = cssVarsUsage.find(
        (x) => x.componentSelector === componentSelector
      ) || {
        result: {
          allVars: [],
          usedVars: [],
          unusedVars: [],
        },
      };
      return assertComponentCssVarsUsage(
        componentFilePath,
        componentSelector,
        componentVarsUsage.result
      );
    })
  );

  function displayValue(numberOfFiles: number): string {
    return `${pluralizeToken(
      'component',
      numberOfFiles
    )} not using all the css variables provided`;
  }

  const auditOutput: AuditOutput = {
    slug: dsCssVarsUsageAuditSlug,
    score: 1,
    value: 0,
    displayValue: displayValue(0),
  };

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

export async function assertComponentCssVarsUsage(
  file: string,
  selector: string,
  cssVarsUsage: DsCssVarsUsage
): Promise<Issue> {
  // informative issue (component styles are OK)
  const issue = {
    source: { file: toUnixPath(file) },
  } satisfies Pick<Issue, 'source'>;

  // missing variables in styles
  if (cssVarsUsage.unusedVars.length) {
    return {
      ...issue,
      severity: 'error',
      message: `<b>${selector}</b> - Unused css variables: <span style="color: red">${cssVarsUsage.unusedVars
        .join(', ')
        .substring(0, 800)}</span>`,
    } satisfies Issue;
  }

  // return informative Issue
  return {
    ...issue,
    severity: 'info',
    message: `<b>${selector}</b> - Used css variables: <span style="color: green">${cssVarsUsage.usedVars
      .join(', ')
      .substring(0, 800)}</span>`,
  } satisfies Issue;
}

function filterSeverityError(issue: Issue): issue is Issue {
  return issue.severity === 'error';
}
