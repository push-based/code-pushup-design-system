import { ParsedTemplate } from '@angular/compiler';
import { Root } from 'postcss';
import { Asset } from '../utils/types';

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
