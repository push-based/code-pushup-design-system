export { parseClassNames } from './lib/angular/template/utils';

export { classDecoratorVisitor } from './lib/typescript/decorator-config.visitor';

export { parseComponents } from './lib/angular/parse-component';
export type { ParsedComponent } from './lib/angular/types';
export { findComponents } from './lib/angular/find-component';

export { visitComponentStyles } from './lib/styles/utils';

export { tmplAstElementToSource, visitComponentTemplate } from './lib/angular/template/utils';

export { visitEachTmplChild } from './lib/angular/template/template.walk';

export { CssAstVisitor } from './lib/styles/stylesheet.visitor';
export { styleAstRuleToSource } from './lib/styles/utils';
export { DiagnosticsAware } from './lib/utils/diagnostics';

export {
  visitEachChild,
} from './lib/styles/stylesheet.walk';

export { Asset } from './lib/utils/types';
