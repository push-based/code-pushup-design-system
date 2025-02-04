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
import { DiagnosticsAware } from './diagnostics';
import { ComponentReplacement } from '@code-pushup-design-system/angular-ds-coverage';

function generateClassUsageMessage({
  elementName,
  className,
  attribute,
  dsComponentName = 'a DS component',
  docsUrl,
  icon = '🔲',
}: {
  icon?: string;
  elementName: string;
  className: string;
  attribute: string;
  dsComponentName?: string;
  docsUrl?: string;
}): string {
  const iconString = icon ? `${icon} ` : '';
  const docsLink = docsUrl
    ? ` <a href="${docsUrl}" target="_blank">Learn more</a>.`
    : '';
  return `${iconString} The <code>${elementName}</code> element's <code>${className}</code> class deprecated. Use <code>${dsComponentName}</code>.${docsLink}`;
}

function parseClassNames(classString: string): string[] {
  return classString.trim().split(/\s+/).filter(Boolean);
}

export function tmplAstElementToIssue(
  element: TmplAstElement,
  message: string
): Issue {
  return {
    message:
      message ??
      'Wrong class usage in component template. Replace it with the appropriate DS component for consistency.',
    severity: 'error',
    source: {
      file: element.sourceSpan.start.file.url,
      position: {
        startLine: element.startSourceSpan?.start.line + 1,
        endLine: (element.endSourceSpan?.end.line ?? 0) + 1,
        startColumn: element.startSourceSpan?.start.col + 1,
        endColumn: (element.endSourceSpan?.end.col ?? 0) + 1,
      },
    },
  };
}

export class ClassUsageVisitor
  implements TmplAstVisitor<void>, DiagnosticsAware
{
  private issues: Issue[] = [];
  private currentElement: TmplAstElement | null = null;

  constructor(private readonly componentReplacement: ComponentReplacement) {}

  getIssues(): Issue[] {
    return this.issues;
  }

  visitElement(element: TmplAstElement): void {
    this.currentElement = element;

    element.attributes.forEach((attr) => attr.visit(this)); // Check `class="..."`
    element.inputs.forEach((input) => input.visit(this)); // Check `[class.foo]`, `[ngClass]`

    element.children.forEach((child) => child.visit(this));

    this.currentElement = null;
  }

  visitTextAttribute(attribute: TmplAstTextAttribute): void {
    if (attribute.name === 'class' && this.currentElement) {
      attribute.text = 'test';
      const classNames = parseClassNames(attribute.value);
      for (const className of classNames) {
        if (this.componentReplacement.matchingCssClasses.includes(className)) {
          const message = generateClassUsageMessage({
            elementName: this.currentElement.name,
            className,
            attribute: 'class',
            dsComponentName: this.componentReplacement.componentName,
            docsUrl: this.componentReplacement.docsUrl,
          });

          this.issues.push(tmplAstElementToIssue(this.currentElement, message));
        }
      }
    }
  }

  visitBoundAttribute(attribute: TmplAstBoundAttribute): void {
    if (!this.currentElement) return;

    if (
      attribute.type === BindingType.Class &&
      this.componentReplacement.matchingCssClasses.includes(attribute.name)
    ) {
      const message = generateClassUsageMessage({
        elementName: this.currentElement.name,
        className: attribute.name,
        attribute: '[class]',
        dsComponentName: this.componentReplacement.componentName,
        docsUrl: this.componentReplacement.docsUrl,
      });
      this.issues.push(tmplAstElementToIssue(this.currentElement, message));
    }

    if (attribute.name === 'ngClass') {
      const value: ASTWithSource = attribute.value as ASTWithSource;
      const sourceString = value.source ?? '';
      for (const className of this.componentReplacement.matchingCssClasses) {
        if (sourceString.includes(className)) {
          const message = generateClassUsageMessage({
            elementName: this.currentElement.name,
            className,
            attribute: '[ngClass]',
            dsComponentName: this.componentReplacement.componentName,
            docsUrl: this.componentReplacement.docsUrl,
          });
          this.issues.push(tmplAstElementToIssue(this.currentElement, message));
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
