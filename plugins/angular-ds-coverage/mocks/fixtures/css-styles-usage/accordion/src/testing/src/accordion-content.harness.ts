import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

export type DsAccordionContentHarnessFilters = BaseHarnessFilters;

export class DsAccordionContentHarness extends ComponentHarness {
    static hostSelector = 'ds-accordion-content';

    // Factory method for creating an Accordion Harness with specific filters.
    static with(options: DsAccordionContentHarnessFilters): HarnessPredicate<DsAccordionContentHarness> {
        return new HarnessPredicate(DsAccordionContentHarness, options);
    }

    /** Gets a promise for the text. */
    async getContentText(): Promise<string> {
        return (await this.host()).text();
    }
}
