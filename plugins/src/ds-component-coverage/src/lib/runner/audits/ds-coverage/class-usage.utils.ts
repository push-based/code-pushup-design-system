import { Asset, visitEachTmplChild } from '../../../../../../utils/src';
import { ComponentReplacement } from './types';
import { ClassUsageVisitor } from './class-usage.visitor';
import { ParsedTemplate } from '@angular/compiler';

export async function getClassUsageIssues(
  componentReplacement: ComponentReplacement,
  asset: Asset<ParsedTemplate>
) {
  const visitor = new ClassUsageVisitor(componentReplacement, asset.startLine);
  const parsedTemplate = await asset.parse();
  visitEachTmplChild(parsedTemplate.nodes, visitor);

  return visitor.getIssues();
}
