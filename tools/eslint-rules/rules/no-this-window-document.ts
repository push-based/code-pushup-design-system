import type { TSESTree } from '@typescript-eslint/types';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { eslintRuleFactory } from './rule-creator-factory';

export const RULE_NAME = 'no-this-window-document';

export const rule = eslintRuleFactory(__filename)({
    name: RULE_NAME,
    meta: {
        schema: [],
        type: 'problem',
        docs: {
            description: 'Disallow usage of window.document and suggest using DOCUMENT from @angular/common',
        },
        messages: {
            noThisWindowDocument: 'Avoid accessing the document via the window. Use this._doc declared as: private readonly _doc = inject(DOCUMENT);',
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            MemberExpression(node: TSESTree.MemberExpression) {
                const isThisPrivateWindowDocument =
                    node.object.type === AST_NODE_TYPES.MemberExpression &&
                    node.object.object.type === AST_NODE_TYPES.ThisExpression &&
                    node.object.property.type === AST_NODE_TYPES.PrivateIdentifier &&
                    node.object.property.name === 'window' &&
                    node.property.type === AST_NODE_TYPES.Identifier &&
                    node.property.name === 'document';

                if (isThisPrivateWindowDocument) {
                    context.report({
                        node,
                        messageId: 'noThisWindowDocument',
                    });
                }
            },
        };
    },
});
