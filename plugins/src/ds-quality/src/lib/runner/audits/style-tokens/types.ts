type NoLeadingDashes<T extends string> = T extends `--${string}`
  ? never
  : T;

export type TokenReplacement = {
  tokenName: string;
  deprecatedTokens: NoLeadingDashes<string>[];
  docsUrl?: string;
};
