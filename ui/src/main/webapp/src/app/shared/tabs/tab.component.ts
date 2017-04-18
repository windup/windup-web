import {Component, Input} from "@angular/core";

/**
 * Tabs component.
 *
 * Should be used inside <wu-tab-container>
 *
 */
@Component({
    template: `<ng-content *ngIf="isActive"></ng-content>`,
    selector: 'wu-tab'
})
export class TabComponent {
    /**
     * Displayed tab title
     */
    @Input()
    tabTitle: string;

    /**
     * Any additional tab properties
     * (not required)
     */
    @Input()
    properties: any;

    /**
     * Flag indicating if tab is active
     */
    @Input()
    isActive: boolean;
}
