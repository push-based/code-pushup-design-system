import { PersistConfig, Report } from '@code-pushup/models';
import {
  ensureDirectoryExists,
  HIERARCHY,
  isPromiseFulfilledResult,
  isPromiseRejectedResult,
  readJsonFile,
  scoreReport,
  sortReport,
  stringifyError,
  ui,
  toTitleCase,
  formatReportScore
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
} from '@code-pushup/utils/src/lib/reports/generate-md-report-category-section';
import { formatScoreWithColor } from '@code-pushup/utils/src/lib/reports/utils';

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

  let markdown = generateMdReportSummaryTable(labeledReports);
  markdown += generateMdReportsSummaryForMonorepo(labeledReports);

  const { outputDir, filename } = persistConfig;
  const outputPath = path.join(outputDir, `${filename}-summary.md`);
  await ensureDirectoryExists(outputDir);
  await writeFile(outputPath, markdown);

  return outputPath;
}

function generateMdReportSummaryTable(labeledReports: LabeledReport[]): string {
  const cats = labeledReports.reduce(
    (acc, { label, ...report }) => {
      acc.push({
        label,
        categories: report.categories
          .reduce((acc, { slug, score }) => {
            acc.push({
              slug,
              score,
            });
            return acc;
          }, [] as { slug: string; score: number }[])
          .sort((a, b) => (b.slug < a.slug ? 1 : -1)),
      });
      return acc;
    },
    [] as {
      label: string;
      categories: { slug: string; score: number }[];
    }[]
  );

  const uniqueCategories = cats.flatMap(
    ({ categories }) => categories.map(({ slug }) => slug),
    [] as string[]
  );

  const uniqueCategoriesSorted = Array.from(new Set(uniqueCategories.sort()));
  return new MarkdownDocument()
    .heading(HIERARCHY.level_1, 'Entain Monorepo Report Summary')
    .heading(HIERARCHY.level_2, 'Repository Overview')
    .rule()
    .table(
      ['💼 Project', ...uniqueCategoriesSorted.map((cat) => '🏷 ' + toTitleCase(cat))],
      cats.map(({ label, categories }) => [
        toTitleCase(label),
        ...uniqueCategoriesSorted.map((categorySlug) => {
          const { score } =
            categories.find(({ slug }) => categorySlug === slug) ?? {};
          return score ? formatScoreWithColor(score) : '-';
        }),
      ])
    )
    .rule()
    .toString();
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
  const { heading = REPORT_HEADLINE_TEXT } = options ?? {};

  return new MarkdownDocument()
    .heading(HIERARCHY.level_1, heading)
    .$concat(
      ...(hasCategories(report)
        ? [categoriesOverviewSection(report), categoriesDetailsSection(report)]
        : [])
    )
    .toString();
}
