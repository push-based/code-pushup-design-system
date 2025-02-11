import * as ts from 'typescript';
import {
  assetFromPropertyArrayInitializer,
  assetFromPropertyValueInitializer,
  extractStringValue,
  isComponentDecorator,
} from './utils';
import {
  visitAngularDecoratorProperties,
  visitAngularDecorators,
} from './ts.walk';
import { parseTemplate } from '@angular/compiler';
import { resolveFileCached } from '../utils/file.resolver';
import * as path from 'node:path';
import { ParsedComponent } from '../utils/types';
import { parseStylesheet } from '../styles/stylesheet.parse';

const DEBUG = false;
const debug = ({
  step,
  title,
  info,
}: {
  step: string;
  title: string;
  info: string | null | undefined;
}) =>
  DEBUG &&
  console.log(
    `─── 📌 [${step}]: ${title} ${
      info ? '-' + info : ''
    }──────────────────────────────`
  );

export function classDecoratorVisitor({
  sourceFile,
}: {
  sourceFile: ts.SourceFile;
}) {
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
      activeComponent = {
        startLine: ts.getLineAndCharacterOfPosition(
          sourceFile,
          node.getStart(sourceFile)
        ).line, // 0 indexed (linkable index is set in the issue creation logic)
        className: currentClassName,
        fileName: sourceFile.fileName,
      } as ParsedComponent;

      visitAngularDecorators(node, (decorator: ts.Decorator) => {
        debug({
          step: 'ENTER',
          title: 'ClassDecorators',
          info: 'of ' + currentClassName,
        });
        if (isComponentDecorator(decorator)) {
          // console.log(`[ENTER]: ComponentDecorator ->${currentClassName}`);
          debug({
            step: 'ENTER',
            title: 'ClassDecorator',
            info: '@Component',
          });
          visitAngularDecoratorProperties(
            decorator,
            (prop: ts.PropertyAssignment) => {
              if (
                !ts.isPropertyAssignment(prop) ||
                !ts.isIdentifier(prop.name)
              ) {
                return;
              }

              const propName = prop.name.escapedText as string;
              const propValue = getPropValue(
                prop,
                sourceFile,
                currentClassName ?? 'undefined-calss'
              );
              if (activeComponent) {
                (activeComponent as any)[propName] = propValue;

                debug({
                  step: 'Update',
                  title: 'ParsedComponent',
                  info: `add ${propName}`,
                });
              }
            }
          );

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

function getPropValue(
  prop: ts.PropertyAssignment,
  sourceFile: ts.SourceFile,
  currentClassName: string
) {
  const propName = (prop.name as any).escapedText as string;
  switch (propName) {
    case 'templateUrl':
    case 'template':
      return assetFromPropertyValueInitializer({
        prop,
        sourceFile,
        textParser: async (text: string) => {
          const filePath =
            propName === 'templateUrl'
              ? path.join(path.dirname(sourceFile.fileName), text)
              : sourceFile.fileName;
          const content =
            propName === 'templateUrl'
              ? await resolveFileCached(filePath)
              : text;

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
        }
  })
    case 'styles':
    case 'styleUrls':
      return assetFromPropertyArrayInitializer(
        prop,
        sourceFile,
        async (text: string) => {
          const filePath =
            propName === 'styleUrls'
              ? path.join(path.dirname(sourceFile.fileName), text)
              : sourceFile.fileName;
          const content =
            propName === 'styleUrls' ? await resolveFileCached(filePath) : text;

          debug({
            step: 'RESOLVE',
            title: 'Styles',
            info: `${currentClassName}; file ${filePath}`,
          });
          return parseStylesheet(content, filePath);
        }
      );
    default:
      // @TODO: Implement all of the decorator props
      return extractStringValue(prop.initializer, sourceFile);
  }
}
