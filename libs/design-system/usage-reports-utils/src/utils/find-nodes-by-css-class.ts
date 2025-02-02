import { parseTemplate } from '@angular/compiler';

import { ClassCollectorVisitor } from './class-collector-visitor';

export type ClassCollectorResult = {
  cssClass: string;
  lineOfCode: number;
};
export function findNodesByCssClass(
  fileContent: string,
  cssClasses: string[]
): Array<ClassCollectorResult> {
  const ast = parseTemplate(fileContent, 'tpl.html');
  const results: Array<ClassCollectorResult> = [];

  for (const cssClass of cssClasses) {
    const visitor = new ClassCollectorVisitor(cssClass);
    visitor.visitAll(ast.nodes);
    const matchingElements = visitor.getMatchingElements();

    for (const element of matchingElements) {
      results.push({
        cssClass,
        lineOfCode: element.sourceSpan.start.line + 1,
      });
    }
  }

  return results.sort((a, b) => a.lineOfCode - b.lineOfCode);
}
