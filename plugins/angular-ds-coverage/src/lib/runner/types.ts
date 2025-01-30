import { ParsedTemplate } from '@angular/compiler';
import { Root } from 'postcss';
import { styleAndTemplateProps } from './constants';

export type Props = (typeof styleAndTemplateProps)[number];

export type ParsedAsset = { value: string; startLine: number };

export type ParsedComponentWithTemplateProp<T extends ParsedAsset> = {
  template?: T;
  templateUrl?: never;
};
export type ParsedComponentWithTemplateUrlProp<T extends ParsedAsset> = {
  templateUrl?: T;
  template?: never;
};
export type ParsedComponentWithResolvedTemplate =
  | ParsedComponentWithTemplateProp<ParsedAsset & { ast: ParsedTemplate }>
  | ParsedComponentWithTemplateUrlProp<ParsedAsset & { ast: ParsedTemplate }>;
export type ParsedComponentWithStylesProp<T extends ParsedAsset> = {
  styles?: T[];
  styleUrls?: never;
};
export type ParsedComponentWithStyleUrlProp<T extends ParsedAsset> = {
  styleUrls?: T[];
  styles?: never;
};
export type ParsedComponentWithResolvedStyles =
  | ParsedComponentWithStylesProp<ParsedAsset & { ast: Root }>
  | ParsedComponentWithStyleUrlProp<ParsedAsset & { ast: Root }>;

export type ComponentBase = {
  filePath: string;
  decoratorName: string;
  className: string;
  selector?: string;
};

export type ParsedComponent = ComponentBase &
  (
    | ParsedComponentWithTemplateProp<ParsedAsset>
    | ParsedComponentWithTemplateUrlProp<ParsedAsset>
  ) &
  (
    | ParsedComponentWithStylesProp<ParsedAsset>
    | ParsedComponentWithStyleUrlProp<ParsedAsset>
  );
export type ResolvedComponent = ComponentBase &
  ParsedComponentWithResolvedStyles &
  ParsedComponentWithResolvedTemplate;

export type MatchingElement = {
  name: string;
  sourceSpan: {
    start: {
      file: {
        url: string;
      };
      line: number;
      col?: number;
    };
  };
};
