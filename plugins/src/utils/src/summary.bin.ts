import { generateReportsSummaryForMonorepo } from './lib/reporting/generate-md-monorepo-report-summary';
(async () =>
  await generateReportsSummaryForMonorepo('.code-pushup', { outputDir: '.code-pushup', filename: 'monorepo-ds-summary', format: ['md'] }))();
