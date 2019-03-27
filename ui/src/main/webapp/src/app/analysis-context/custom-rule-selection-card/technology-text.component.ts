import { Component } from "@angular/core";
import { Input } from '@angular/core';
import { Technology } from "../../generated/windup-services";

@Component({
    selector: 'wu-technology-text',
    // template: `{{technology.name}}{{versionRangeSuffix}}`,
    template: `<span class="active-filter label label-primary"> {{technology.name}}{{versionRangeSuffix}} </span>`,
    styleUrls: ['./technology-text.component.scss']
})
export class TechnologyTextComponent {

    @Input()
    technology: Technology;

    constructor() { }

    get versionRangeSuffix(): string {
        if (this.technology.versionRange)
            return ":" + this.technology.versionRange;
        else
            return "";
    }
}
