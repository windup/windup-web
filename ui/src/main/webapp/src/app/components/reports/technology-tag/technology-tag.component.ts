import {Component, Input} from "@angular/core";
import {TechnologyTagModel} from "../../../generated/tsModels/TechnologyTagModel";
import {TagDTO} from "windup-services";

@Component({
    selector: 'wu-technology-tag',
    template: `<span [class]="tagClass">{{tagValue}}</span>`
})
export class TechnologyTagComponent {
    @Input()
    tag:TechnologyTagModel | TechnologyTag | string;

    get tagClass():string {
        let tagLevel = "info";

        if (this.tag instanceof TechnologyTagModel)
            tagLevel = this.tag.level == 'IMPORTANT' ? 'danger' : 'info';
        else if ((<any>this.tag).level)
            tagLevel = (<any>this.tag).level;

        return `label label-${tagLevel} tag`;
    }

    get tagValue():string {
        if (this.tag instanceof TechnologyTagModel)
            return (<TechnologyTagModel>this.tag).name;
        else if ((<any>this.tag).name)
            return (<any>this.tag).name;
        else
            return <string>this.tag;
    }
}

export interface TechnologyTag {
    name:string;
    level:string;
}