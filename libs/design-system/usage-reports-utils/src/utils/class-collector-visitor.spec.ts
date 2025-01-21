import { TmplAstTextAttribute, parseTemplate } from '@angular/compiler';

import { ClassCollectorVisitor } from './class-collector-visitor';

describe('ClassCollectorVisitor', () => {
  describe('class bindings', () => {
    it('should not find class when it is not a class-binding', () => {
      const template = `
                <ms-list-item
                    [count]="link.count"
                    >
                </ms-list-item>
             `;

      const { foundElements } = setup({ template, targetClassName: 'count' });

      expect(foundElements).toHaveLength(0);
    });
    it('<div class="count">1</div> should find node with css class', () => {
      const template = `<div class="count">1</div>`;
      const { foundElements } = setup({ template, targetClassName: 'count' });

      expect(foundElements).toHaveLength(1);
    });

    it('<div class="count">1</div> should find node within other css classes', () => {
      const template = `<div class="a count b">1</div>`;
      const { foundElements } = setup({ template, targetClassName: 'count' });

      expect(foundElements).toHaveLength(1);
    });

    it('<div [class.count]="true">2</div>', () => {
      const template = `<div [class.count]="true">2</div>`;
      const { foundElements } = setup({ template, targetClassName: 'count' });

      expect(foundElements).toHaveLength(1);
    });

    it('<div [class.count]="false">2</div> should find node with class-binding', () => {
      const template = `<div [class.count]="false">2</div>`;
      const { foundElements } = setup({ template, targetClassName: 'count' });

      expect(foundElements).toHaveLength(1);
    });

    it('<div [class.a]="true">3</div> should not find not when other class is used in class-binding', () => {
      const template = `<div [class.a]="true">3</div>`;
      const { foundElements } = setup({ template, targetClassName: 'count' });

      expect(foundElements).toHaveLength(0);
    });

    it('<div [class.a]="false">3</div> should not find node when other class is used in class-binding', () => {
      const template = `<div [class.a]="false">3</div>`;
      const { foundElements } = setup({ template, targetClassName: 'count' });

      expect(foundElements).toHaveLength(0);
    });

    it("<div [ngClass]=\"['count', 'second']\">5</div> should find node when class is used in ngClass-binding", () => {
      const template = `<div [ngClass]="['count', 'second']">5</div>`;
      const { foundElements } = setup({ template, targetClassName: 'count' });

      expect(foundElements).toHaveLength(1);
    });
    it('<div [ngClass]="{ count: true, second: true, third: true }">6</div> should find node when class is used in ngClass-binding with object-binding', () => {
      const template = `<div [ngClass]="{ count: true, second: true, third: true }">6</div>`;
      const { foundElements } = setup({ template, targetClassName: 'count' });

      expect(foundElements).toHaveLength(1);
    });
    it('<div [ngClass]="{ count: false, second: true, third: true }">6</div> should find node when class is used in ngClass-binding with object-binding and other classes', () => {
      const template = `<div [ngClass]="{ count: false, second: true, third: true }">6</div>`;
      const { foundElements } = setup({ template, targetClassName: 'count' });

      expect(foundElements).toHaveLength(1);
    });

    it('<div [ngClass]="{ \'count second\': true }">7</div> should find node when class is used in ngClass-binding with object-binding and condensed signature', () => {
      const template = `<div [ngClass]="{ 'count second': true }">7</div>`;
      const { foundElements } = setup({ template, targetClassName: 'count' });

      expect(foundElements).toHaveLength(1);
    });

    it('<div [ngClass]="{ \'count second\': false }">7</div>', () => {
      const template = `<div [ngClass]="{ 'count second': false }">7</div>`;
      const { foundElements } = setup({ template, targetClassName: 'count' });

      expect(foundElements).toHaveLength(1);
    });
  });
  it('should find all nodes in @if-blocks', () => {
    const template = `
            @if (true){
              <div id="1" class="foo"></div>
            }
             <div>
              <span>
                 @if (true){
                  <div id="2" class="foo"></div>
                  }
              </span>
            </div>
      `;

    const { foundElements } = setup({ template, targetClassName: 'foo' });

    expect(foundElements).toHaveLength(2);
    expect(
      verifyAttributes({
        sourceAttributes: foundElements[0].attributes,
        expectedAttributeProperties: [
          { name: 'id', value: '1' },
          { name: 'class', value: 'foo' },
        ],
      })
    ).toBe(true);

    expect(
      verifyAttributes({
        sourceAttributes: foundElements[1].attributes,
        expectedAttributeProperties: [
          { name: 'id', value: '2' },
          { name: 'class', value: 'foo' },
        ],
      })
    ).toBe(true);
  });

  it('should find all nodes with *ngIf', () => {
    const template = `
          <ng-container *ngIf="true">
           <div id="1" class="foo"></div>
          </ng-container>
           <div>
          <span>

                <div *ngIf="true" id="2" class="foo"></div>

          </span>
        </div>
      `;
    const { foundElements } = setup({ template, targetClassName: 'foo' });

    expect(foundElements).toHaveLength(2);
    expect(
      verifyAttributes({
        sourceAttributes: foundElements[0].attributes,
        expectedAttributeProperties: [
          { name: 'id', value: '1' },
          { name: 'class', value: 'foo' },
        ],
      })
    ).toBe(true);

    expect(
      verifyAttributes({
        sourceAttributes: foundElements[1].attributes,
        expectedAttributeProperties: [
          { name: 'id', value: '2' },
          { name: 'class', value: 'foo' },
        ],
      })
    ).toBe(true);
  });

  it('should find all nodes in @for-block', () => {
    const template = `
        @for (item of items; track item.name) {
          <div id="1" class="foo"></div>
        }
        <div>
          <span>
            @for (item of items; track item.name) {
              <div id="2" class="foo"></div>
            }
          </span>
        </div>
      `;

    const { foundElements } = setup({ template, targetClassName: 'foo' });

    expect(foundElements).toHaveLength(2);
    expect(
      verifyAttributes({
        sourceAttributes: foundElements[0].attributes,
        expectedAttributeProperties: [
          { name: 'id', value: '1' },
          { name: 'class', value: 'foo' },
        ],
      })
    ).toBe(true);

    expect(
      verifyAttributes({
        sourceAttributes: foundElements[1].attributes,
        expectedAttributeProperties: [
          { name: 'id', value: '2' },
          { name: 'class', value: 'foo' },
        ],
      })
    ).toBe(true);
  });

  it('should find all nodes with *ngFor', () => {
    const template = `
        <div id="1" *ngFor="let item of [1,2,3]" class="foo"></div>
      `;

    const { foundElements } = setup({ template, targetClassName: 'foo' });

    expect(foundElements).toHaveLength(1);
    expect(
      verifyAttributes({
        sourceAttributes: foundElements[0].attributes,
        expectedAttributeProperties: [
          { name: 'id', value: '1' },
          { name: 'class', value: 'foo' },
        ],
      })
    ).toBe(true);
  });

  it('should find all nodes with *switch', () => {
    const template = `
        <ng-container *ngSwitchCase="userPermissions">
          <ng-container *ngSwitchCase="'admin'">
            <div id="1" class="foo"></div>
          </ng-container>
           <ng-container *ngSwitchCase="'reviewer'">

          </ng-container>
            <ng-container *ngSwitchDefault>

          </ng-container>
        </ng-container>
      `;

    const { foundElements } = setup({ template, targetClassName: 'foo' });

    expect(foundElements).toHaveLength(1);
    expect(
      verifyAttributes({
        sourceAttributes: foundElements[0].attributes,
        expectedAttributeProperties: [
          { name: 'id', value: '1' },
          { name: 'class', value: 'foo' },
        ],
      })
    ).toBe(true);
  });

  it('should find all nodes inside @switch', () => {
    const template = `
          @switch (userPermissions) {
            @case ('admin') {
              <div id="1" class="foo"></div>
            }
            @case ('reviewer') {

            }
            @case ('editor') {

            }
            @default {

            }
          }
        `;
    const { foundElements } = setup({ template, targetClassName: 'foo' });

    expect(foundElements).toHaveLength(1);
    expect(
      verifyAttributes({
        sourceAttributes: foundElements[0].attributes,
        expectedAttributeProperties: [
          { name: 'id', value: '1' },
          { name: 'class', value: 'foo' },
        ],
      })
    ).toBe(true);
  });

  it('should find all nodes inside @defer', () => {
    const template = `
          @defer {
              <div id="1" class="foo"></div>
          }
        `;
    const { foundElements } = setup({ template, targetClassName: 'foo' });

    expect(foundElements).toHaveLength(1);
    expect(
      verifyAttributes({
        sourceAttributes: foundElements[0].attributes,
        expectedAttributeProperties: [
          { name: 'id', value: '1' },
          { name: 'class', value: 'foo' },
        ],
      })
    ).toBe(true);
  });
});

function setup(options: { template: string; targetClassName: string }) {
  const ast = parseTemplate(options.template, 'template.html');
  const visitor = new ClassCollectorVisitor(options.targetClassName);

  visitor.visitAll(ast.nodes);

  return {
    foundElements: visitor.getMatchingElements(),
  };
}

function verifyAttributes(args: {
  sourceAttributes: TmplAstTextAttribute[];
  expectedAttributeProperties: Pick<TmplAstTextAttribute, 'value' | 'name'>[];
}): boolean {
  const { sourceAttributes, expectedAttributeProperties } = args;

  // Check if all expected attributes are contained in the source attributes
  return expectedAttributeProperties.every((expected) =>
    sourceAttributes.some(
      (source) =>
        source.name === expected.name && source.value === expected.value
    )
  );
}
