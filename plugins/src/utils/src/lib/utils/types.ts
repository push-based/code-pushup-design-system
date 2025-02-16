export type SourceLink = { filePath: string; startLine: number };
export type Asset<T> = SourceLink & {
  parse: () => Promise<T>;
};
