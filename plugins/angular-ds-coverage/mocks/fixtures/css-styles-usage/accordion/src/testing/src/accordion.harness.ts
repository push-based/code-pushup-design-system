import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';


import { DsAccordionContentHarness } from './accordion-content.harness';
import { DsAccordionHeaderHarness } from './accordion-header.harness';
import { DsAccordionSize, DsAccordionVariant } from '../../accordion.component';

export type DsAccordionHarnessFilters = {
    /** Only find instances whose size matches the given value. */
    size?: DsAccordionSize;

    /** Only find instances whose size matches the given variant. */
    variant?: DsAccordionVariant;

    /** Only find instances which match the given inverse state. */
    inverse?: boolean;

    /** Only find instances which match the given open state. */
    open?: boolean;

    /** Only find instances which match the given title. */
    headerTitle?: string;

    /** Only find instances which match the given subtitle. */
    headerSubtitle?: string;
} & BaseHarnessFilters;

export class DsAccordionHarness extends ComponentHarness {
    static hostSelector = 'ds-accordion';

    private accordionHeader = this.locatorForOptional(DsAccordionHeaderHarness);
    private accordionContent = this.locatorForOptional(DsAccordionContentHarness);

    // Factory method for creating an Accordion Harness with specific filters.
    static with(options: DsAccordionHarnessFilters): HarnessPredicate<DsAccordionHarness> {
        return new HarnessPredicate(DsAccordionHarness, options)
            .addOption('size', options.size, (harness, size) => harness.hasSize(size))
            .addOption('variant', options.variant, (harness, variant) => harness.hasVariant(variant))
            .addOption('inverse', options.inverse, async (harness, inverse) => (await harness.isInverse()) === inverse)
            .addOption('open', options.open, async (harness, open) => (await harness.isOpen()) === open)
            .addOption('headerTitle', options.headerTitle, async (harness, title) =>
                HarnessPredicate.stringMatches(harness.getHeaderTitleText(), title),
            )
            .addOption('headerSubtitle', options.headerSubtitle, async (harness, subtitle) =>
                HarnessPredicate.stringMatches(harness.getHeaderSubtitleText(), subtitle),
            );
    }

    /** Method to get the applied classes from the host element */
    async getHostClasses(): Promise<string | null> {
        return (await this.host()).getAttribute('class');
    }

    /** Retrieves the entire slot as a TestElement for complex content analysis. */
    async getAccordionContentHarness(): Promise<DsAccordionContentHarness | null> {
        return await this.accordionContent();
    }

    async getAccordionHeaderHarness(): Promise<DsAccordionHeaderHarness | null> {
        return await this.accordionHeader();
    }

    /** Checks if a specific size is applied. **/
    async hasSize(size: DsAccordionSize): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.includes(size) ?? false;
    }

    /** Checks if a specific variant is applied. **/
    async hasVariant(variant: DsAccordionVariant): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.includes(variant) ?? false;
    }

    /** Gets a boolean promise indicating if the accordion is open. */
    async isOpen(): Promise<boolean> {
        const host = await this.host();
        return await host.hasClass('ds-accordion-opened');
    }

    /** Gets a boolean promise indicating if the accordion is inversed. */
    async isInverse(): Promise<boolean> {
        const host = await this.host();
        return await host.hasClass('ds-accordion-inverse');
    }

    /** Gets a promise for the header title text. */
    async getHeaderSubtitleText(): Promise<string | null> {
        const headerHarness = await this.getAccordionHeaderHarness();
        return headerHarness?.getSubtitleText() ?? null;
    }

    /** Gets a promise for the header subtitle text. */
    async getHeaderTitleText(): Promise<string | null> {
        const headerHarness = await this.getAccordionHeaderHarness();
        return headerHarness?.getTitleText() ?? null;
    }
}
