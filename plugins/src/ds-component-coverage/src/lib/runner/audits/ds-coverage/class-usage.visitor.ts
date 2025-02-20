import {
  ASTWithSource,
  BindingType,
  TmplAstBoundAttribute,
  TmplAstBoundEvent,
  TmplAstBoundText,
  TmplAstContent,
  TmplAstDeferredBlock,
  TmplAstDeferredBlockError,
  TmplAstDeferredBlockLoading,
  TmplAstDeferredBlockPlaceholder,
  TmplAstDeferredTrigger,
  TmplAstElement,
  TmplAstForLoopBlock,
  TmplAstForLoopBlockEmpty,
  TmplAstIcu,
  TmplAstIfBlock,
  TmplAstIfBlockBranch,
  TmplAstLetDeclaration,
  TmplAstReference,
  TmplAstSwitchBlock,
  TmplAstSwitchBlockCase,
  TmplAstTemplate,
  TmplAstText,
  TmplAstTextAttribute,
  TmplAstUnknownBlock,
  TmplAstVariable,
  TmplAstVisitor,
} from '@angular/compiler';
import { Issue } from '@code-pushup/models';
import {
  DiagnosticsAware,
  tmplAstElementToSource,
} from '../../../../../../utils/src';

import {
  EXTERNAL_ASSET_ICON,
  INLINE_ASSET_ICON,
  TEMPLATE_ASSET_ICON,
} from './constants';

import { ComponentReplacement } from './types';
import { parseClassNames } from '../../../../../../utils/src/index';

function generateClassUsageMessage({
  element,
  className,
  attribute,
  componentName = 'a DS component',
  docsUrl,
}: {
  element: TmplAstElement;
  className: string;
  attribute: string;
} & Pick<ComponentReplacement, 'docsUrl' | 'componentName'>): string {
  const elementName = element.name;
  const isInline = element.sourceSpan.start.file.url.match(/\.ts$/) != null;
  const iconString = `${
    isInline ? INLINE_ASSET_ICON : EXTERNAL_ASSET_ICON
  }${TEMPLATE_ASSET_ICON} `;
  const docsLink = docsUrl
    ? ` <a href="${docsUrl}" target="_blank">Learn more</a>.`
    : '';
  return `${iconString} Element <code>${elementName}</code> in attribute <code>${attribute}</code> uses deprecated class <code>${className}</code>. Use <code>${componentName}</code> instead.${docsLink}`;
}

export class ClassUsageVisitor
  implements TmplAstVisitor<void>, DiagnosticsAware
{
  private issues: Issue[] = [];
  private currentElement: TmplAstElement | null = null;

  constructor(
    private readonly componentReplacement: ComponentReplacement,
    private readonly startLine = 0
  ) {}

  getIssues(): Issue[] {
    return this.issues;
  }

  clear(): void {
    this.issues = [];
  }

  visitElement(element: TmplAstElement): void {
    this.currentElement = element;

    element.attributes.forEach((attr) => attr.visit(this)); // Check `class="..."`
    element.inputs.forEach((input) => input.visit(this)); // Check `[class.foo]`, `[ngClass]`

    element.children.forEach((child) => child.visit(this));

    this.currentElement = null;
  }

  visitTextAttribute(attribute: TmplAstTextAttribute): void {
    const { deprecatedCssClasses, ...compRepl } = this.componentReplacement;
    if (attribute.name === 'class' && this.currentElement) {
      const classNames = parseClassNames(attribute.value);
      for (const className of classNames) {
        if (deprecatedCssClasses.includes(className)) {
          const isInline =
            attribute.sourceSpan.start.file.url.match(/\.ts$/) != null;
          const startLine = isInline ? this.startLine : 0;
          this.issues.push({
            severity: 'error', // @TODO if we consider transformations this needs to be dynamic
            message: generateClassUsageMessage({
              ...compRepl,
              element: this.currentElement,
              className,
              attribute: `${attribute.name}`,
            }),
            source: tmplAstElementToSource(this.currentElement, startLine),
          });
        }
      }
    }
  }

  visitBoundAttribute(attribute: TmplAstBoundAttribute): void {
    if (!this.currentElement) return;

    const { deprecatedCssClasses, ...compRepl } = this.componentReplacement;

    // Check `[class.foo]`
    if (
      attribute.type === BindingType.Class &&
      deprecatedCssClasses.includes(attribute.name)
    ) {
      this.issues.push({
        severity: 'error', // @TODO if we consider transformations this needs to be dynamic
        message: generateClassUsageMessage({
          element: this.currentElement,
          className: attribute.name,
          attribute: '[class.*]',
          componentName: this.componentReplacement.componentName,
          docsUrl: this.componentReplacement.docsUrl,
        }),
        source: tmplAstElementToSource(this.currentElement, this.startLine),
      });
    }

    if (attribute.name === 'ngClass') {
      const value: ASTWithSource = attribute.value as ASTWithSource;
      const sourceString = value.source ?? '';
      for (const className of deprecatedCssClasses) {
        if (sourceString.includes(className)) {
          this.issues.push({
            severity: 'error', // @TODO if we consider transformations this needs to be dynamic
            message: generateClassUsageMessage({
              ...compRepl,
              element: this.currentElement,
              className,
              attribute: `[${attribute.name}]`,
            }),
            source: tmplAstElementToSource(this.currentElement, this.startLine),
          });
        }
      }
    }
  }

  visitTemplate(template: TmplAstTemplate): void {
    template.children.forEach((child) => child.visit(this));
  }

  visitContent(content: TmplAstContent): void {
    content.children.forEach((child) => child.visit(this));
  }

  visitForLoopBlock(block: TmplAstForLoopBlock): void {
    block.children.forEach((child) => child.visit(this));
    block.empty?.visit(this);
  }

  visitForLoopBlockEmpty(block: TmplAstForLoopBlockEmpty): void {
    block.children.forEach((child) => child.visit(this));
  }

  visitIfBlock(block: TmplAstIfBlock): void {
    block.branches.forEach((branch) => branch.visit(this));
  }

  visitIfBlockBranch(block: TmplAstIfBlockBranch): void {
    block.children.forEach((child) => child.visit(this));
  }

  visitSwitchBlock(block: TmplAstSwitchBlock): void {
    block.cases.forEach((caseBlock) => caseBlock.visit(this));
  }

  visitSwitchBlockCase(block: TmplAstSwitchBlockCase): void {
    block.children.forEach((child) => child.visit(this));
  }

  visitDeferredBlock(deferred: TmplAstDeferredBlock): void {
    deferred.visitAll(this);
  }

  visitDeferredBlockError(block: TmplAstDeferredBlockError): void {
    block.children.forEach((child) => child.visit(this));
  }

  visitDeferredBlockLoading(block: TmplAstDeferredBlockLoading): void {
    block.children.forEach((child) => child.visit(this));
  }

  visitDeferredBlockPlaceholder(block: TmplAstDeferredBlockPlaceholder): void {
    block.children.forEach((child) => child.visit(this));
  }

  // -- No-op Methods --
  visitVariable(_variable: TmplAstVariable): void {}

  visitReference(_reference: TmplAstReference): void {}

  visitText(_text: TmplAstText): void {}

  visitBoundText(_text: TmplAstBoundText): void {}

  visitIcu(_icu: TmplAstIcu): void {}

  visitBoundEvent(_event: TmplAstBoundEvent): void {}

  visitUnknownBlock(_block: TmplAstUnknownBlock): void {}

  visitDeferredTrigger(_trigger: TmplAstDeferredTrigger): void {}

  visitLetDeclaration(_decl: TmplAstLetDeclaration): void {}
}
