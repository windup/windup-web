import {Component} from "@angular/core";
import {Input} from '@angular/core';
import { Technology } from "../../generated/windup-services";

@Component({
    selector: 'wu-technology-text',
    template: `{{technology.name}}{{versionRangeSuffix}}`
})
export class TechnologyTextComponent {

    @Input()
    technology: Technology;

    constructor() {}

    get versionRangeSuffix(): string {
        if (this.technology.versionRange)
            return ":" + this.technology.versionRange;
        else
            return "";
    }
}
