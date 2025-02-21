import type { ISSUE_CODES } from './constants';

type NoLeadingDashes<T extends string> = T extends `--${string}`
  ? never
  : T;

export type DeprecationDefinition = {
  deprecatedEntity: NoLeadingDashes<string>;
  replacement?: NoLeadingDashes<string>;
  docsUrl?: string;
};

export type IssueCodes = (typeof ISSUE_CODES)[keyof typeof ISSUE_CODES];
