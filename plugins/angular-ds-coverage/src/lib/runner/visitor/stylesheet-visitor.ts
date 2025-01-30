class CssStylesheetAst {
  constructor(public rules: CssRuleAst[]) {}

  visit(visitor: StylesheetVisitor, context: any) {
    return visitor.visitStylesheet(this, context);
  }
}

class CssRuleAst {
  constructor(public selector: string, public declarations: CssDeclarationAst[]) {}

  visit(visitor: StylesheetVisitor, context: any) {
    visitor.visitRule(this, context);
    this.declarations.forEach(decl => decl.visit(visitor, context));
  }
}

class CssDeclarationAst {
  constructor(public property: string, public value: string) {}

  visit(visitor: StylesheetVisitor, context: any) {
    visitor.visitDeclaration(this, context);
  }
}


interface StylesheetVisitor {
  visitStylesheet(stylesheet: CssStylesheetAst, context: any): any;
  visitRule(rule: CssRuleAst, context: any): any;
  visitDeclaration(decl: CssDeclarationAst, context: any): any;
  visitSelector(sel: CssSelectorAst, context: any): any;
}
