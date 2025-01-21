import { AuditOutput, TableRowObject } from '@code-pushup/models';
import {
  crawlFileSystem,
  pluralizeToken,
  readTextFile,
} from '@code-pushup/utils';

import { getSelectors } from '../../utils';
import { dsComponentsSelectors } from '../plugins/ds-components-selectors';

export const dsComponentsUsageAuditSlug = 'ds-components-usage';
const auditTableColumns = [
  { key: 'source', label: 'Source file' },
  { key: 'selector', label: 'DS component selector' },
  { key: 'component', label: 'DS component name' },
  { key: 'count', label: 'Usage count' },
];
interface DsUsageData {
  file: string;
  components: DsComponent[];
}

interface DsComponent {
  selector: string;
  component: string;
  count: number;
}

export async function getDsComponentsUsageAuditOutput(
  directory: string
): Promise<AuditOutput> {
  const data: DsUsageData[] = await crawlFileSystem({
    directory,
    pattern: '^.*.html$',
    fileTransform: async (filePath: string) => {
      const dsComponentsUsed = await getSelectorsCount(filePath);
      return {
        file: filePath,
        components: dsComponentsUsed,
      };
    },
  });

  const auditOutput: AuditOutput = {
    slug: dsComponentsUsageAuditSlug,
    score: 1,
    value: 0,
    displayValue: displayValue(0),
  };

  const rows = data.filter((v) => v.components.length > 0).flatMap(toRows);

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

function displayValue(count: number): string {
  return `${pluralizeToken('component', count)} using Design System components`;
}

export async function getSelectorsCount(
  filePath: string
): Promise<DsComponent[]> {
  const classes = Object.keys(dsComponentsSelectors);
  const selectors = getSelectors(classes);
  const counts: DsComponent[] = [];
  const componentContent = await readTextFile(filePath);
  selectors.forEach((regex, index) => {
    const matches = componentContent.match(regex);
    if (matches) {
      counts.push({
        selector: classes[index],
        component: dsComponentsSelectors[classes[index]],
        count: matches.length,
      });
    }
  });

  return counts;
}

function toRows(data: DsUsageData): TableRowObject[] {
  return data.components.map((o) => {
    return {
      source: data.file,
      selector: o.selector,
      component: o.component,
      count: o.count,
    };
  });
}
