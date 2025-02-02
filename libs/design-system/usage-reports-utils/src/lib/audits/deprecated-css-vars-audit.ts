import { AuditOutput, Issue } from '@code-pushup/models';
import { factorOf, pluralizeToken, toUnixPath } from '@code-pushup/utils';

import { ComponentStylesData, DsCssVarsUsage } from '../../models';

export const dsDeprecatedCssVarsAuditSlug = 'angular-ds-deprecated-css-vars';

export async function getDeprecatedCssVarsAuditOutput(
  componentStylesData: ComponentStylesData[],
  cssVarsUsage: { componentSelector: string; result: DsCssVarsUsage }[],
  deprecatedCssVars: string[],
  deprecatedCssVarsFilePath: string
): Promise<AuditOutput> {
  function displayValue(numberOfFiles: number): string {
    return `${pluralizeToken(
      'component',
      numberOfFiles
    )} using deprecated css variables`;
  }

  const auditOutput: AuditOutput = {
    slug: dsDeprecatedCssVarsAuditSlug,
    score: 1,
    value: 0,
    displayValue: displayValue(0),
  };

  const componentDeprecatedCssVarsUsage = componentStylesData.map(
    ({ componentFilePath, componentSelector }) => {
      const componentVarsUsage = cssVarsUsage.find(
        (x) => x.componentSelector === componentSelector
      );
      if (!componentVarsUsage) return;
      const deprecatedCssVarsUsage = componentUsedDeprecatedCssVars(
        componentVarsUsage.result.usedVars,
        deprecatedCssVars
      );
      return { componentFilePath, componentSelector, deprecatedCssVarsUsage };
    }
  );

  const usedDeprecatedCssVars = componentDeprecatedCssVarsUsage.reduce(
    (acc: string[], curr) => {
      if (curr) {
        acc.push(...curr.deprecatedCssVarsUsage);
      }
      return acc;
    },
    []
  );

  const unusedDeprecatedCssVars = deprecatedCssVars.filter(
    (x) => !usedDeprecatedCssVars.includes(x)
  );

  const issues = await Promise.all(
    componentStylesData.map(({ componentFilePath, componentSelector }) => {
      const result = componentDeprecatedCssVarsUsage.find(
        (x) => x && x.componentSelector === componentSelector
      );
      return assertDeprecatedCssVarsUsage(
        componentFilePath,
        componentSelector,
        result?.deprecatedCssVarsUsage || []
      );
    })
  );

  if (unusedDeprecatedCssVars.length) {
    const unused = unusedDeprecatedCssVars.join(', ').substring(0, 800);
    issues.push({
      source: { file: toUnixPath(deprecatedCssVarsFilePath) },
      severity: 'info',
      message: `<span style="color: green">Not used css vars that can be <b>removed</b> (${unusedDeprecatedCssVars.length}) </span>: <br> ${unused}...</span>`,
    } satisfies Issue);
  }

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

export function assertDeprecatedCssVarsUsage(
  file: string,
  selector: string,
  deprecatedCssVarsUsage: string[]
): Issue {
  // informative issue (component styles are OK)
  const issue = {
    source: { file: toUnixPath(file) },
  } satisfies Pick<Issue, 'source'>;

  if (deprecatedCssVarsUsage.length === 0) {
    return {
      ...issue,
      severity: 'info',
      message: `<b>${selector}</b> - Is not using deprecated CSS variables</span>`,
    } satisfies Issue;
  }

  // return informative Issue
  return {
    ...issue,
    severity: 'error',
    message: `<b>${selector}</b> - Using deprecated css variables: <span style="color: red">${deprecatedCssVarsUsage
      .join(', ')
      .substring(0, 800)}</span>`,
  } satisfies Issue;
}

function componentUsedDeprecatedCssVars(
  cmpUsedCssVars: string[],
  allDeprecatedCssVars: string[]
): string[] {
  return cmpUsedCssVars.filter((v) => allDeprecatedCssVars.includes(v));
}

function filterSeverityError(issue: Issue): issue is Issue {
  return issue.severity === 'error';
}
