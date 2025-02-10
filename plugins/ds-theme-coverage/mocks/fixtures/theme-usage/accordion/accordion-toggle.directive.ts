import { Directive, inject } from '@angular/core';

import { DsAccordion } from './accordion.component';

@Directive({
    selector: '[dsAccordionToggle]',
    standalone: true,
    host: {
        '(click)': 'handleClick($event)',
    },
})
export class DsAccordionToggle {
    protected accordion = inject(DsAccordion, { optional: true });

    handleClick($event: PointerEvent) {
        this.accordion?.toggle();
        $event.preventDefault();
        $event.stopPropagation();
    }
}
