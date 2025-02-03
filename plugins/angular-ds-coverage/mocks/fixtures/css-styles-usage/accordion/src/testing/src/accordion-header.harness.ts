import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing';

import { DsAccordionToggleHarness } from './accordion-toggle.harness';

export type DsAccordionHeaderHarnessFilters = {
    /** Only find instances which match the given title. */
    title?: string;

    /** Only find instances which match the given subtitle. */
    subtitle?: string;
} & BaseHarnessFilters;

export class DsAccordionHeaderHarness extends ComponentHarness {
    static hostSelector = 'ds-accordion-header';

    private titleEl = this.locatorForOptional('[slot=title]');
    private subTitleEl = this.locatorForOptional('[slot=subtitle]');
    private accordionToggle = this.locatorFor(DsAccordionToggleHarness);

    // Factory method for creating an Accordion Harness with specific filters.
    static with(options: DsAccordionHeaderHarnessFilters): HarnessPredicate<DsAccordionHeaderHarness> {
        return new HarnessPredicate(DsAccordionHeaderHarness, options)
            .addOption('title', options.title, async (harness, title) => HarnessPredicate.stringMatches(harness.getTitleText(), title))
            .addOption('subtitle', options.subtitle, async (harness, subtitle) =>
                HarnessPredicate.stringMatches(harness.getSubtitleText(), subtitle),
            );
    }

    /** Retrieves the entire slot as a TestElement for complex content analysis.*/
    async getStartSlotElement(): Promise<TestElement> {
        return this.locatorFor('.ds-accordion-header-start')();
    }

    /** Retrieves the entire slot as a TestElement for complex content analysis. */
    async getEndSlotElement(): Promise<TestElement> {
        return this.locatorFor('.ds-accordion-header-end')();
    }

    /** Gets a promise for the title text. */
    async getSubtitleText(): Promise<string | null> {
        return (await this.subTitleEl())?.text() ?? null;
    }

    /** Gets a promise for the subtitle text. */
    async getTitleText(): Promise<string | null> {
        return (await this.titleEl())?.text() ?? null;
    }

    async clickToggle() {
        await (await this.accordionToggle()).click();
    }

    async getTriggerElement() {
        return this.locatorFor('.ds-accordion-header-trigger')();
    }
}
