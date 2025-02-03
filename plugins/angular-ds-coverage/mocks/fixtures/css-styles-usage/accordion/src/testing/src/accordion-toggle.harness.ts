import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

export type DsAccordionToggleHarnessFilters = BaseHarnessFilters;

export class DsAccordionToggleHarness extends ComponentHarness {
    static hostSelector = '[dsAccordionToggle]';

    // Factory method for creating an Accordion Harness with specific filters.
    static with(options: DsAccordionToggleHarnessFilters): HarnessPredicate<DsAccordionToggleHarness> {
        return new HarnessPredicate(DsAccordionToggleHarness, options);
    }

    async click() {
        await (await this.host()).click();
    }
}
