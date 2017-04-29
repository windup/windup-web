import {Component, Input} from "@angular/core";
import {TechnologyTagModel} from "../../generated/tsModels/TechnologyTagModel";

@Component({
    selector: 'wu-technology-tag',
    template: `<span [class]="tagClass">{{tagValue}}</span>`
})
export class TechnologyTagComponent {
    @Input()
    tag:{name: string, level: string} | string;

    get tagClass(): string {
        let tagLevel = "info";

        if ((<any>this.tag).level == "INFORMATIONAL")
            tagLevel = "info";
        else if ((<any>this.tag).level == "IMPORTANT")
            tagLevel = "danger";

        return `label label-${tagLevel} tech-tag`;
    }

    get tagValue(): string {
        if ((<any>this.tag).name)
            return (<any>this.tag).name;
        else
            return <string>this.tag;
    }
}
