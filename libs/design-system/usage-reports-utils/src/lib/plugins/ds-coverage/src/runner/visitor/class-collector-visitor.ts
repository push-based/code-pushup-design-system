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
  TmplAstNode,
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

/**
 * Traverses an Angular template and collecting nodes which have a certain css class applied.
 */
export class ClassCollectorVisitor implements TmplAstVisitor<void> {
  private matchingElements: TmplAstElement[] = [];
  private targetClass: string;

  constructor(className: string) {
    this.targetClass = className;
  }

  getMatchingElements(): TmplAstElement[] {
    return this.matchingElements;
  }

  visitAll(nodes: TmplAstNode[]): void {
    nodes.forEach((node) => {
      node.visit(this);
    });
  }

  private parseClassNames(classString: string): string[] {
    return classString.trim().split(/\s+/).filter(Boolean);
  }

  private hasClass(element: TmplAstElement): boolean {
    // Check static class attribute
    const classAttr = element.attributes.find((attr) => attr.name === 'class');
    if (classAttr) {
      const classNames = this.parseClassNames(classAttr.value);
      if (classNames.includes(this.targetClass)) {
        return true;
      }
    }

    // Check [class] binding
    const inputBinding = element.inputs.find(
      (input) => input.name === this.targetClass
    );

    /**
     * Both [count]="true" and [class.a]="true" are inputs and we need
     * to find the correct BindingType to determine if it is a class binding.
     */
    if (inputBinding && inputBinding.type === BindingType.Class) {
      return true;
    }

    // check [ngClass] binding
    const ngClassBinding = element.inputs.find(
      (input) => input.name === 'ngClass'
    );
    if (ngClassBinding) {
      const value: ASTWithSource = ngClassBinding.value as ASTWithSource;
      if (value.source?.includes(this.targetClass)) {
        return true;
      }
    }

    return false;
  }

  visitElement(element: TmplAstElement): void {
    if (this.hasClass(element)) {
      this.matchingElements.push(element);
    }

    // Visit children
    this.visitAll(element.children);
  }

  visitTemplate(template: TmplAstTemplate): void {
    // For structural directives, we only want to process the children
    this.visitAll(template.children);
  }

  visitContent(content: TmplAstContent): void {
    this.visitAll(content.children);
  }

  // Block handling
  visitForLoopBlock(block: TmplAstForLoopBlock): void {
    this.visitAll(block.children);
    block.empty?.visit(this);
  }

  visitForLoopBlockEmpty(block: TmplAstForLoopBlockEmpty): void {
    this.visitAll(block.children);
  }

  visitIfBlock(block: TmplAstIfBlock): void {
    this.visitAll(block.branches);
  }

  visitIfBlockBranch(block: TmplAstIfBlockBranch): void {
    this.visitAll(block.children);
  }

  visitSwitchBlock(block: TmplAstSwitchBlock): void {
    this.visitAll(block.cases);
  }

  visitSwitchBlockCase(block: TmplAstSwitchBlockCase): void {
    this.visitAll(block.children);
  }

  visitDeferredBlock(deferred: TmplAstDeferredBlock): void {
    deferred.visitAll(this);
  }
  visitDeferredBlockError(block: TmplAstDeferredBlockError): void {
    this.visitAll(block.children);
  }
  visitDeferredBlockLoading(block: TmplAstDeferredBlockLoading): void {
    this.visitAll(block.children);
  }
  visitDeferredBlockPlaceholder(block: TmplAstDeferredBlockPlaceholder): void {
    this.visitAll(block.children);
  }
  // No-op methods for other node types
  visitVariable(_variable: TmplAstVariable): void {}
  visitReference(_reference: TmplAstReference): void {}
  visitText(_text: TmplAstText): void {}
  visitBoundText(_text: TmplAstBoundText): void {}
  visitIcu(_icu: TmplAstIcu): void {}
  visitBoundAttribute(_attribute: TmplAstBoundAttribute): void {}
  visitBoundEvent(_event: TmplAstBoundEvent): void {}
  visitTextAttribute(_attribute: TmplAstTextAttribute): void {}
  visitUnknownBlock(_block: TmplAstUnknownBlock): void {}
  visitDeferredTrigger(_trigger: TmplAstDeferredTrigger): void {}
  visitLetDeclaration(_decl: TmplAstLetDeclaration): void {}
}
