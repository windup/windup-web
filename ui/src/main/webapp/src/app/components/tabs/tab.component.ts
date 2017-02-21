import {Component, Input} from "@angular/core";

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
