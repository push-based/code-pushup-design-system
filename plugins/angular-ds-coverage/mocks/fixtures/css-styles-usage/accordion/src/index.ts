import { NgModule } from '@angular/core';

import { DsAccordionContent } from './accordion-content.component';
import { DsAccordionHeader } from './accordion-header.component';
import { DsAccordionToggle } from './accordion-toggle.directive';
import { DsAccordionTrigger } from './accordion-trigger.directive';
import { DS_ACCORDION_SIZE_ARRAY, DS_ACCORDION_VARIANT_ARRAY, DsAccordion, DsAccordionSize, DsAccordionVariant } from './accordion.component';

export {
    DsAccordion,
    DS_ACCORDION_SIZE_ARRAY,
    DsAccordionSize,
    DS_ACCORDION_VARIANT_ARRAY,
    DsAccordionVariant,
    DsAccordionContent,
    DsAccordionHeader,
    DsAccordionTrigger,
    DsAccordionToggle,
};

@NgModule({
    imports: [DsAccordion, DsAccordionHeader, DsAccordionTrigger, DsAccordionContent, DsAccordionToggle],
    exports: [DsAccordion, DsAccordionHeader, DsAccordionTrigger, DsAccordionContent, DsAccordionToggle],
})
export class DsAccordionModule {}
