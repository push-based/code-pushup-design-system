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
import { tmplAstElementToIssue } from './utils';
import { visitEachTmplChild } from './template.walk';
import { Issue } from '@code-pushup/models';
import { DiagnosticsAware } from './diagnostics';

/**
 * Traverses an Angular template to find nodes that have any one of several CSS classes.
 */
export class ClassUsageTemplateVisitor
  implements TmplAstVisitor<void>, DiagnosticsAware
{
  private issues: Issue[] = [];

  /**
   * @param targetClasses An array of classes to check, e.g. ['btn', 'active', 'foo']
   */
  constructor(private readonly targetClasses: string[]) {}

  getIssue(): Issue[] {
    return this.issues;
  }

  private visitChildren(children?: TmplAstNode[] | null) {
    if (children && children.length) {
      visitEachTmplChild(children, this);
    }
  }

  /**
   * Checks if the element has any of the target classes via:
   * 1) A static "class" attribute,
   * 2) A "[class.someClass]" binding,
   * 3) An "[ngClass]" binding containing that class name as a substring.
   */
  private elementHasAnyTargetClass(element: TmplAstElement): false | string {
    // 1. Static class attribute
    const classAttr = element.attributes.find((attr) => attr.name === 'class');
    if (classAttr) {
      const classNames = this.parseClassNames(classAttr.value);
      const usedClass = this.targetClasses.find((cls) =>
        classNames.includes(cls)
      );
      if (usedClass != null) {
        return usedClass;
      }
    }

    // 2. Check for `[class.someClass]` binding
    for (const input of element.inputs) {
      if (
        input.type === BindingType.Class &&
        this.targetClasses.includes(input.name)
      ) {
        return input.name;
      }
    }

    // 3. Check [ngClass] if it references any target class substring
    const ngClassBinding = element.inputs.find(
      (input) => input.name === 'ngClass'
    );
    if (ngClassBinding) {
      const value: ASTWithSource = ngClassBinding.value as ASTWithSource;
      const sourceString = value.source ?? '';
      const classNames = this.targetClasses.find((cls) =>
        sourceString.includes(cls)
      );
      if (classNames != null) {
        return classNames;
      }
    }

    return false;
  }

  private parseClassNames(classString: string): string[] {
    return classString.trim().split(/\s+/).filter(Boolean);
  }

  // -- TmplAstVisitor Implementations --

  visitElement(element: TmplAstElement): void {
    const targetClass = this.elementHasAnyTargetClass(element);
    if (targetClass) {
      this.issues.push(tmplAstElementToIssue(element, targetClass));
    }
    this.visitChildren(element.children);
  }

  visitTemplate(template: TmplAstTemplate): void {
    this.visitChildren(template.children);
  }

  visitContent(content: TmplAstContent): void {
    this.visitChildren(content.children);
  }

  // -- Blocks --

  visitForLoopBlock(block: TmplAstForLoopBlock): void {
    this.visitChildren(block.children);
    block.empty?.visit(this);
  }

  visitForLoopBlockEmpty(block: TmplAstForLoopBlockEmpty): void {
    this.visitChildren(block.children);
  }

  visitIfBlock(block: TmplAstIfBlock): void {
    // Instead of `this.visitAll(block.branches)`, we call our utility:
    visitEachTmplChild(block.branches, this);
  }

  visitIfBlockBranch(block: TmplAstIfBlockBranch): void {
    this.visitChildren(block.children);
  }

  visitSwitchBlock(block: TmplAstSwitchBlock): void {
    visitEachTmplChild(block.cases, this);
  }

  visitSwitchBlockCase(block: TmplAstSwitchBlockCase): void {
    this.visitChildren(block.children);
  }

  visitDeferredBlock(deferred: TmplAstDeferredBlock): void {
    // This TmplAstDeferredBlock offers its own "visitAll" method,
    // which is akin to our visitEachChild utility for its child nodes.
    deferred.visitAll(this);
  }

  visitDeferredBlockError(block: TmplAstDeferredBlockError): void {
    this.visitChildren(block.children);
  }
  visitDeferredBlockLoading(block: TmplAstDeferredBlockLoading): void {
    this.visitChildren(block.children);
  }
  visitDeferredBlockPlaceholder(block: TmplAstDeferredBlockPlaceholder): void {
    this.visitChildren(block.children);
  }

  // -- No-op methods --
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
