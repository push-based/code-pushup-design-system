import { Directive } from '@angular/core';

export interface DsAccordionTriggerContext {
    $implicit: boolean;
}

@Directive({
    selector: 'ng-template[dsAccordionTrigger]',
    standalone: true,
})
export class DsAccordionTrigger {
    static ngTemplateContextGuard(directive: DsAccordionTrigger, context: unknown): context is DsAccordionTriggerContext {
        return true;
    }
}
