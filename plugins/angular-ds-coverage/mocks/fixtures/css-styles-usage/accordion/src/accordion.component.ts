import { NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    EventEmitter,
    Output,
    TemplateRef,
    ViewEncapsulation,
    booleanAttribute,
    computed,
    input,
    signal,
} from '@angular/core';

export const DS_ACCORDION_SIZE_ARRAY = ['small', 'large'] as const;
export type DsAccordionSize = (typeof DS_ACCORDION_SIZE_ARRAY)[number];

export const DS_ACCORDION_VARIANT_ARRAY = ['transparent', 'surface-lowest', 'surface-low', 'surface-high', 'surface-highest'] as const;
export type DsAccordionVariant = (typeof DS_ACCORDION_VARIANT_ARRAY)[number];

@Component({
    selector: 'ds-accordion',
    template: `
        <div class="ds-accordion-header-wrapper">
            <ng-content select="ds-accordion-header" />
        </div>

        <div class="ds-accordion-content" [class.ds-accordion-content-closed]="!isOpen()()">
            @if (isOpen()()) {
                @if (contentTemplate) {
                    <ng-container [ngTemplateOutlet]="contentTemplate" />
                } @else {
                    <ng-content select="ds-accordion-content" />
                }
            }
        </div>
    `,
    host: {
        '[class]': 'hostClass()',
        '[class.ds-accordion-inverse]': 'inverse()',
        '[class.ds-accordion-opened]': 'isOpen()()',
    },
    styleUrl: 'accordion.component.scss',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet],
})
export class DsAccordion {
    // Accessibility
    openAccordionLabel = input('Open Accordion');
    closeAccordionLabel = input('Close Accordion');

    variant = input<DsAccordionVariant>('transparent');
    size = input<DsAccordionSize>('large');
    inverse = input(false, { transform: booleanAttribute });

    // TODO: use with linkedSignal when monorepo uses v19, and drop custom impl
    open = input(false, { transform: booleanAttribute });
    @Output() openedChange = new EventEmitter<boolean>();

    @ContentChild('content', { read: TemplateRef })
    contentTemplate?: TemplateRef<any>;

    // TODO: convert to linkedSignal, -> writable computed pattern here, get the value using isOpen()()
    isOpen = computed(() => signal(this.open()));

    protected hostClass = computed(() => `ds-accordion ds-accordion-${this.variant()} ds-accordion-${this.size()}`);

    toggle() {
        this.isOpen().update((x) => !x);
        this.openedChange.emit(this.isOpen()());
    }
}
