import {
  ClassCollectorResult,
  findNodesByCssClass,
} from './find-nodes-by-css-class';

const BETBUILDER_HELP_HTML = `
<div class="betbuilder-help-page" (msOutsideInteraction)="close()" msOutsideInteractionExclude=".modal-dialog-header-wrapper,.header-title">
    <div class="help-page-heading" (click)="toggleHelp()" *ngIf="showHeader">
        <div class="help-page-title">{{ translations['helpPageTitle'] }}</div>
        <span
            class="help-page-toggle-icon"
            [ngClass]="collapsed ? 'theme-info' : 'theme-info-i'"
            *ngIf="isPrecreatedBetBuilderEnabled && collapsible"></span>
    </div>
    <div class="help-page-build-a-bet-info" [innerHTML]="helpPageContent"></div>
    <div *ngIf="!collapsed" class="help-page-toggle-wrap">
        <div class="example-title">{{ translations['exampleTitle'] }}</div>
        <div class="example">
            <div class="legs">
                <div class="market-leg" *ngFor="let leg of helpPageLegs">
                    <div class="circle-overlay"><div class="theme-radio-off"></div></div>
                    <span class="leg">{{ leg }}</span>
                </div>
            </div>
            <div class="event-name">{{ exampleEventName }}</div>
            <span class="odds">{{ exampleOdds }}</span>
        </div>
        <div class="help-page-footer">
            <div class="help-page-buttons" *ngIf="showHelpButtons">
                <button class="btn btn-primary" (click)="onOkClicked()">{{ okButtonText }}</button>
                <button class="btn btn-tertiary" [innerHTML]="helpPageLearnMoreLink" (click)="onLearnMoreClick()"></button>
            </div>
            <div class="help-page-link" [innerHTML]="helpPageLink"></div>
        </div>
    </div>

    <div class="foo"></div>
</div>

`;
const NESTED_HTML = `
  @if (true){
    <div id="1" class="foo"></div>
  }
  <ng-container *ngIf="true">
   <div id="2" class="foo"></div>
  </ng-container>

  @for (let i = 0; i < 10; i++) {
    <div id="3" class="foo"></div>
  }

   <div id="4" *ngFor="" class="foo"></div>
`;
describe('findNodesByCssClass', () => {
  describe('goldens', () => {
    it('should find 2 btn and one foo node in BETBUILDER_HELP_HTML', () => {
      const nodes = findNodesByCssClass(BETBUILDER_HELP_HTML, ['btn', 'foo']);

      const expectedResult: ClassCollectorResult[] = [
        {
          cssClass: 'btn',
          lineOfCode: 25,
        },
        {
          cssClass: 'btn',
          lineOfCode: 26,
        },
        {
          cssClass: 'foo',
          lineOfCode: 32,
        },
      ];
      expect(nodes).toHaveLength(3);
      expect(nodes).toEqual(expectedResult);
    });
    it('should find 2 btn and one foo node in NESTED_HTML', () => {
      const nodes = findNodesByCssClass(NESTED_HTML, ['btn', 'foo']);

      const expectedResult: ClassCollectorResult[] = [
        {
          cssClass: 'foo',
          lineOfCode: 3,
        },
        {
          cssClass: 'foo',
          lineOfCode: 6,
        },
        {
          cssClass: 'foo',
          lineOfCode: 13,
        },
      ];
      expect(nodes).toHaveLength(3);
      expect(nodes).toEqual(expectedResult);
    });
  });
});
