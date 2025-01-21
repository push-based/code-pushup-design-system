import { AuditOutput, TableRowObject } from '@code-pushup/models';
import {
  crawlFileSystem,
  pluralizeToken,
  readTextFile,
} from '@code-pushup/utils';

import { DSProperty, DsOverride } from '../../models';

export const dsTokensOverrideAuditSlug = 'ds-tokens-override';
const auditTableColumns = [
  { key: 'source', label: 'Source file' },
  { key: 'token', label: 'DS token' },
  { key: 'value', label: 'Overridden value' },
];

export async function getTokensOverrideAuditOutput(
  directory: string
): Promise<AuditOutput> {
  const data: DsOverride[] = await crawlFileSystem({
    directory,
    pattern: '^.*.scss$',
    fileTransform: async (filePath: string) => {
      const dsPropertyRegex = /(--ds-[a-zA-Z0-9-_]+):\s*([^;]+);/g;
      const componentContent = await readTextFile(filePath);
      let match: RegExpExecArray | null;
      const results: DSProperty[] = [];
      while ((match = dsPropertyRegex.exec(componentContent)) != null) {
        const property = match[1];
        const value = match[2].trim();
        results.push({ property, value });
      }
      return { file: filePath, overrides: results };
    },
  });

  const auditOutput: AuditOutput = {
    slug: dsTokensOverrideAuditSlug,
    score: 1,
    value: 0,
    displayValue: displayValue(0),
  };

  const rows = data.filter((v) => v.overrides.length > 0).flatMap(toRows);

  if (rows.length === 0) {
    return auditOutput;
  }

  return {
    ...auditOutput,
    score: 0,
    value: rows.length,
    displayValue: displayValue(rows.length),
    details: {
      table: {
        columns: auditTableColumns,
        rows: rows,
      },
    },
  } satisfies AuditOutput;
}

function displayValue(numberOfFiles: number): string {
  return `${pluralizeToken(
    'token values',
    numberOfFiles
  )} were overridden manually on Design System components consumption`;
}

function toRows(data: DsOverride): TableRowObject[] {
  return data.overrides.map((o) => {
    return { source: data.file, token: o.property, value: o.value };
  });
}
