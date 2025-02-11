import { ParsedTemplate } from '@angular/compiler';
import { Root } from 'postcss';
import * as ts from 'typescript';

export type SourceLink = { filePath: string; startLine: number };
export type Asset<T> = SourceLink & {
  parse: () => Promise<T>;
};

export type ParsedComponent = {
  className: string;
  fileName: string;
  startLine: number;
} & {
  templateUrl: Asset<ParsedTemplate>;
  template: Asset<ParsedTemplate>;
  styles: Asset<Root>[];
  styleUrls: Asset<Root>[];
  styleUrl: Asset<Root>;
} & {
  [key: string]: string; // @TODO implement all of the component props
};
