type NoLeadingDashes<T extends string> = T extends `--${string}`
  ? never
  : T;

export type TokenReplacementDefinition = {
  deprecatedToken: NoLeadingDashes<string>;
  tokenReplacement?: NoLeadingDashes<string>;
  docsUrl?: string;
};
