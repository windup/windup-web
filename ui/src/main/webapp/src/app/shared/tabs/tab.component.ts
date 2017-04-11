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
    @Input()
    tabTitle;

    @Input()
    isActive;
}
