import { AuditOutput, Issue } from '@code-pushup/models';
import { pluralize, slugify } from '@code-pushup/utils';
import { ComponentReplacement } from '@code-pushup-design-system/angular-ds-coverage';

/**
 * Creates a scored audit output.
 * @param componentName
 * @param issues
 * @returns Audit output.
 */
export function getAuditOutput(
  componentName: ComponentReplacement,
  issues: Issue[]
): AuditOutput {
  return {
    slug: getCompCoverageAuditSlug(componentName),
    displayValue: `${issues.length} ${pluralize('class', issues.length)} found`,
    score: issues.length === 0 ? 1 : 0,
    value: issues.length,
    details: {
      issues,
    },
  };
}

export function getCompCoverageAuditSlug({
  componentName,
}: ComponentReplacement): string {
  return slugify(`coverage-${componentName}`);
}
export function getCompCoverageAuditTitle({
  componentName,
}: ComponentReplacement): string {
  return `Usage coverage for ${componentName} component`;
}
export function getCompCoverageAuditDescription({
  componentName,
  matchingCssClasses,
}: ComponentReplacement): string {
  return `Coverage audit for ${componentName} component. Matching classes: ${matchingCssClasses.join(
    ', '
  )}`;
}
