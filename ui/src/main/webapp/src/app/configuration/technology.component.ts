import {Component} from "@angular/core";
import {Input} from '@angular/core';
import {Technology} from "../generated/windup-services";

@Component({
    selector: 'wu-technology',
    template: `{{technology.name}}{{versionRangeSuffix}}`
})
export class TechnologyComponent {

    @Input()
    technology: Technology|any;
    // TODO: This is workaround, without |any it would not find 'windup-services' module;

    constructor() {}

    get versionRangeSuffix():string {
        if (this.technology.versionRange)
            return ":" + this.technology.versionRange;
        else
            return "";
    }
}
