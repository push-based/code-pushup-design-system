import { MarkdownDocument, md } from 'build-md';
import { LabeledReport } from './types.js';
import {
  generateMinimalMdReport,
  isCodePushupReportFile,
  mergeReports,
} from './utils';
import { findFiles } from '../utils/find-in-file';
import * as path from 'node:path';
import { PersistConfig } from '@code-pushup/models';
import { FOOTER_PREFIX, README_LINK } from '@code-pushup/utils';

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
    .rule()
    .paragraph(md`${FOOTER_PREFIX} ${md.link(README_LINK, 'Code PushUp')}`)
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
  await mergeReports(l, persist);
}
