type NoLeadingDashes<T extends string> = T extends `--${string}`
  ? never
  : T;

export type DeprecationDefinition = {
  deprecatedEntity: NoLeadingDashes<string>;
  replacement?: NoLeadingDashes<string>;
  docsUrl?: string;
};
