import {Component, OnDestroy, OnInit} from "@angular/core";
import {Inject, Input} from '@angular/core';

@Component({
    selector: 'wu-progress-bar',
    template: `
        <div class="progress-description">
            <div class="spinner spinner-xs spinner-inline"></div><strong i18n="Progressbar task">Task:</strong> {{taskName ? taskName : "Starting..."}}
        </div>
        <div class="progress progress-label-top-right">
            <div
                    class="progress-bar" role="progressbar"
                    aria-valuemin="0"
                    [attr.aria-valuenow]="currentValue"
                    [attr.aria-valuemax]="maxValue"
                    [style.width]="(currentValue/maxValue)*100 + '%'">
                <span>
                    {{currentValue ? currentValue : "?"}}/{{maxValue ? maxValue : "?"}}
                </span>
            </div>
        </div>`
})
export class ProgressBarComponent {

    @Input()
    taskName:string;
    @Input()
    minValue:number;
    @Input()
    maxValue:number;
    @Input()
    currentValue:number;

    constructor() {}
}
