import { PersistConfig, Report } from '@code-pushup/models';
import {
  ensureDirectoryExists,
  FOOTER_PREFIX,
  HIERARCHY,
  isPromiseFulfilledResult,
  isPromiseRejectedResult,
  readJsonFile,
  README_LINK,
  scoreReport,
  sortReport,
  stringifyError,
  ui,
} from '@code-pushup/utils';
import * as path from 'node:path';
import { generateMdReportsSummaryForMonorepo } from './generate-md-monorepo-report-summary';
import { writeFile } from 'node:fs/promises';
import { LabeledReport, ScoredReport } from './types';
import { MarkdownDocument, md } from 'build-md';
import { REPORT_HEADLINE_TEXT } from '@code-pushup/utils/src/lib/reports/constants';
import {
  categoriesDetailsSection,
  categoriesOverviewSection,
} from '@code-pushup/utils/src/lib/reports/generate-md-report-categoy-section';

export function isCodePushupReportFile(filePath: string): boolean {
  return (filePath.match(/report.json$/) ?? []).length > 0;
}

export async function mergeReports(
  files: string[],
  persistConfig: Required<PersistConfig>
): Promise<string> {
  const results = await Promise.allSettled(
    files.map(async (file) => {
      const json = await readJsonFile(file).catch((error: unknown) => {
        throw new Error(
          `Failed to read JSON file ${file} - ${stringifyError(error)}`
        );
      });

      return {
        data: sortReport(scoreReport(json as Report)),
        file,
      };
    })
  );
  results.filter(isPromiseRejectedResult).forEach(({ reason }) => {
    ui().logger.warning(`Skipped invalid report - ${stringifyError(reason)}`);
  });

  const reports = results
    .filter(isPromiseFulfilledResult)
    .map(({ value }) => value);

  const labeledReports: LabeledReport[] = reports.map((report) => ({
    ...report.data,
    label: path.basename(path.dirname(report.file)),
  }));

  const markdown = generateMdReportsSummaryForMonorepo(labeledReports);

  const { outputDir, filename } = persistConfig;
  const outputPath = path.join(outputDir, `${filename}-summary.md`);
  await ensureDirectoryExists(outputDir);
  await writeFile(outputPath, markdown);

  return outputPath;
}

function hasCategories(
  report: ScoredReport
): report is ScoredReport & Required<Pick<ScoredReport, 'categories'>> {
  return !!report.categories && report.categories.length > 0;
}

export function generateMinimalMdReport(
  report: ScoredReport,
  options?: { heading: string }
): string {
  const { heading = REPORT_HEADLINE_TEXT } = options;
  return new MarkdownDocument()
    .heading(HIERARCHY.level_1, heading)
    .$concat(
      ...(hasCategories(report)
        ? [categoriesOverviewSection(report), categoriesDetailsSection(report)]
        : [])
    )
    .rule()
    .paragraph(md`${FOOTER_PREFIX} ${md.link(README_LINK, 'Code PushUp')}`)
    .toString();
}
