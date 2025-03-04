import { parseTemplate } from '@angular/compiler';

import * as path from 'node:path';
import * as ts from 'typescript';

import { ParsedComponent } from '../angular/types';
import { parseStylesheet } from '../styles/stylesheet.parse';
import { resolveFileCached } from '../utils/file.resolver';
import { visitAngularDecoratorProperties, visitAngularDecorators } from './ts.walk';
import { assetFromPropertyArrayInitializer, assetFromPropertyValueInitializer, isComponentDecorator, removeQuotes } from './utils';

const DEBUG = false;
const debug = ({ step, title, info }: { step: string; title: string; info: string | null | undefined }) =>
  DEBUG && console.log(`─── 📌 [${step}]: ${title} ${info ? '-' + info : ''}──────────────────────────────`);

export function classDecoratorVisitor({ sourceFile }: { sourceFile: ts.SourceFile }) {
  const components: ParsedComponent[] = [];
  let activeComponent: ParsedComponent | null = null;
  let currentClassName: string | null = null;

  const visitor = (node: ts.Node): ts.VisitResult<ts.Node> => {
    // ─── 📌 ENTER: Class Declaration ──────────────────────────────
    if (ts.isClassDeclaration(node)) {
      currentClassName = node.name?.text ?? 'Unknown'; // Capture class name immediately
      debug({
        step: 'ENTER',
        title: 'ClassDeclaration',
        info: `class ${currentClassName}`,
      });
      /* eslint-disable @typescript-eslint/consistent-type-assertions */
      activeComponent = {
        startLine: ts.getLineAndCharacterOfPosition(sourceFile, node.getStart(sourceFile)).line,
        className: currentClassName,
        fileName: sourceFile.fileName,
      } as ParsedComponent;
      /* eslint-enable @typescript-eslint/consistent-type-assertions */

      visitAngularDecorators(node, (decorator: ts.Decorator) => {
        debug({
          step: 'ENTER',
          title: 'ClassDecorators',
          info: 'of ' + currentClassName,
        });
        if (isComponentDecorator(decorator)) {
          debug({
            step: 'ENTER',
            title: 'ClassDecorator',
            info: '@Component',
          });
          visitAngularDecoratorProperties(decorator, (prop: ts.PropertyAssignment) => {
            if (!ts.isPropertyAssignment(prop) || !ts.isIdentifier(prop.name)) {
              return;
            }

            const propName = prop.name.escapedText as string;
            const propValue = getPropValue(prop, sourceFile, currentClassName ?? 'undefined-class');
            if (activeComponent) {
              (activeComponent as ParsedComponent)[propName] = propValue as unknown as string;

              debug({
                step: 'Update',
                title: 'ParsedComponent',
                info: `add ${propName}`,
              });
            }
          });

          if (activeComponent) {
            debug({
              step: 'PUSH',
              title: 'ParsedComponent',
              info: `add ${activeComponent.className}`,
            });
            components.push(activeComponent);
            activeComponent = null;
          }
        }
      });

      debug({
        step: 'EXIT',
        title: 'ClassDeclaration',
        info: `class ${currentClassName}`,
      });
      currentClassName = null;
    }
    return node;
  };

  visitor.components = components;
  return visitor;
}

function getPropValue(prop: ts.PropertyAssignment, sourceFile: ts.SourceFile, currentClassName: string) {
  let propName = '';
  if (ts.isIdentifier(prop.name)) {
    propName = prop.name.escapedText as string;
  } else {
    throw new Error('Property name is not an identifier');
  }
  switch (propName) {
    case 'templateUrl':
    case 'template':
      return assetFromPropertyValueInitializer({
        prop,
        sourceFile,
        textParser: async (text: string) => {
          const filePath = propName === 'templateUrl' ? path.join(path.dirname(sourceFile.fileName), text) : sourceFile.fileName;
          const content = propName === 'templateUrl' ? await resolveFileCached(filePath) : text;

          debug({
            step: 'RESOLVE',
            title: 'Template',
            info: `${currentClassName}; file ${filePath}`,
          });

          return parseTemplate(content, filePath, {
            preserveWhitespaces: true,
            preserveLineEndings: true,
            preserveSignificantWhitespace: true,
          });
        },
      });
    case 'styleUrl':
      return assetFromPropertyValueInitializer({
        prop,
        sourceFile,
        textParser: async (text: string) => {
          const filePath = path.join(path.dirname(sourceFile.fileName), text);
          const content = await resolveFileCached(filePath);

          debug({
            step: 'RESOLVE',
            title: 'styleUrl',
            info: `${currentClassName}; file ${filePath}`,
          });
          return parseStylesheet(content, filePath);
        },
      });
    case 'styles':
    case 'styleUrls':
      return assetFromPropertyArrayInitializer(prop, sourceFile, async (text: string) => {
        const filePath = propName === 'styleUrls' ? path.join(path.dirname(sourceFile.fileName), text) : sourceFile.fileName;
        const content = propName === 'styleUrls' ? await resolveFileCached(filePath) : text;

        debug({
          step: 'RESOLVE',
          title: 'Styles',
          info: `${currentClassName}; file ${filePath}`,
        });
        return parseStylesheet(content, filePath);
      });
    default:
      // @TODO: Implement all of the decorator props
      return removeQuotes(prop.initializer, sourceFile);
  }
}
