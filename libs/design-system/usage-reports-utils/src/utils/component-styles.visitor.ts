import { Root, Rule } from 'postcss';

/**
 * Visitor that collects all CSS rules that contain a specific class
 */
export class CSSClassCollectorVisitor {
  private matchingRules: Rule[] = [];
  private targetClass: string;

  constructor(className: string) {
    this.targetClass = className;
  }

  getMatchingRules(): Rule[] {
    return this.matchingRules;
  }

  visitAll(root: Root): void {
    root.walkRules((rule) => {
      if (this.hasClass(rule)) {
        this.matchingRules.push(rule);
      }
    });
  }

  private hasClass(rule: Rule): boolean {
    return rule.selectors.some((selector) =>
      selector.includes(`.${this.targetClass}`)
    );
  }
}
