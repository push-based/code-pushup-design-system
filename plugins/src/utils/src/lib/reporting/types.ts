import type {
  CategoryConfig,
  Group,
  PluginReport,
  Report,
} from '@code-pushup/models';

export type ScoredCategoryConfig = CategoryConfig & { score: number };
export type LabeledReport = ScoredReport & { label: string };

export type ScoredGroup = Group & {
  score: number;
};

export type ScoredReport = Omit<Report, 'plugins' | 'categories'> & {
  plugins: (Omit<PluginReport, 'groups'> & {
    groups?: ScoredGroup[];
  })[];
  categories?: ScoredCategoryConfig[];
};
