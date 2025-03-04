import { MarkdownDocument } from 'build-md';
import { LabeledReport } from './types.js';
import {
  generateMinimalMdReport,
  isCodePushupReportFile,
  mergeReports,
} from './utils';
import { findFiles } from '../utils/find-in-file';
import * as path from 'node:path';
import { PersistConfig } from '@code-pushup/models';

export function generateMdReportsSummaryForMonorepo(
  reports: LabeledReport[]
): string {
  return new MarkdownDocument()
    .$concat(
      ...reports.map(({ label, ...report }) =>
        new MarkdownDocument().paragraph(
          generateMinimalMdReport(report, { heading: label })
        )
      )
    )
    .toString();
}

export async function generateReportsSummaryForMonorepo(
  baseDir: string,
  persist: Required<PersistConfig>
): Promise<void> {
  const l = [];
  for await (const filePath of findFiles(baseDir, isCodePushupReportFile)) {
    l.push(path.join(process.cwd(), filePath));
  }
  mergeReports(l, persist);
}
