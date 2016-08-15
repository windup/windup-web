import {Component, OnDestroy, OnInit} from "@angular/core";
import {Inject, Input} from '@angular/core';

import {WindupService} from "../services/windup.service";
import {RegisteredApplicationService} from "../services/registeredapplication.service";
import {ProgressStatusModel} from "../models/progressstatus.model";

@Component({
    selector: 'progress-bar',
    template: `
        <div class="progress-description">
            <div class="spinner spinner-xs spinner-inline"></div> <strong>Task:</strong> {{taskName}}
        </div>
        <div class="progress progress-label-top-right">
            <div
                    class="progress-bar" role="progressbar"
                    aria-valuemin="0"
                    [attr.aria-valuenow]="currentValue"
                    [attr.aria-valuemax]="maxValue"
                    [style.width]="(currentValue/maxValue)*100 + '%'">
                <span>
                    {{currentValue}}/{{maxValue}}
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