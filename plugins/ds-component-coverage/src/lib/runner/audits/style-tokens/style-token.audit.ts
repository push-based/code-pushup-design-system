import { getStyleTokenAuditSlug } from './utils';
import { AuditOutput, AuditOutputs, Issue } from '@code-pushup/models';
import { Asset, ParsedComponent } from '../../utils/types';
import { TokenReplacement } from './types';
import { pluralize } from '@code-pushup/utils';
import type { Root } from 'postcss';
import { visitEachStyleNode } from '../../styles/stylesheet.walk';
import { createCssVarUsageVisitor } from './variable-definition.visitor';
import { visitComponentStyles } from '../../styles/utils';

export function dsStyleTokenAuditOutputs(
  tokenReplacements: TokenReplacement[],
  parsedComponents: ParsedComponent[]
): Promise<AuditOutputs> {
  return Promise.all(
    tokenReplacements.map(async (tokenReplacement) => {
      const allIssues = (
        await Promise.all(
          parsedComponents.flatMap(async (component) => {
            return [
              ...(await visitComponentStyles(
                component,
                createGetItems(tokenReplacement)
              ))
            ];
          })
        )
      ).flat();

      return getStyleTokenAuditOutput(tokenReplacement, allIssues);
    })
  );
}


function createGetItems(tokenReplacement: TokenReplacement): (style: Asset<Root>) => Promise<Issue[]> {
  return async (style: Asset<Root>): Promise<Issue[]> => {
    const stylesVisitor = createCssVarUsageVisitor(
      tokenReplacement,
      style.startLine
    );

    const ast: Root = (await style.parse()).root as unknown as Root;
    visitEachStyleNode(ast, stylesVisitor);

    return stylesVisitor.getIssues();
  }
}

export function getStyleTokenAuditOutput(
  tokenReplacement: TokenReplacement,
  issues: Issue[]
): AuditOutput {
  return {
    slug: getStyleTokenAuditSlug(tokenReplacement.tokenName),
    displayValue: `${issues.length} ${pluralize('class', issues.length)} found`,
    score: issues.length === 0 ? 1 : 0,
    value: issues.length,
    details: {
      issues,
    },
  };
}
