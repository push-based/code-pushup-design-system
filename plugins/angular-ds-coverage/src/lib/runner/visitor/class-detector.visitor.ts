class MyCssVisitor implements StylesheetVisitor {
  visitStylesheet(stylesheet: CssStylesheetAst, context: any) {
    console.log(`Visiting Stylesheet`);
    stylesheet.rules.forEach(rule => rule.visit(this, context));
  }

  visitRule(rule: CssRuleAst, context: any) {
    console.log(`Visiting Rule: ${rule.selector}`);
    rule.declarations.forEach(decl => decl.visit(this, context));
  }

  visitDeclaration(decl: CssDeclarationAst, context: any) {
    console.log(`Property: ${decl.property}, Value: ${decl.value}`);
  }

  visitSelector(sel: CssSelectorAst, context: any) {
    console.log(`Selector: ${sel.selector}`);
  }
}
