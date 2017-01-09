import {Component, Input} from "@angular/core";
import {TechnologyTagModel} from "../../../generated/tsModels/TechnologyTagModel";

@Component({
    selector: 'wu-technology-tag',
    template: `<span [class]="tagClass">{{tagValue}}</span>`
})
export class TechnologyTagComponent {
    @Input()
    tag:TechnologyTagModel | string;

    get tagClass():string {
        let tagLevel = "info";

        if (this.tag instanceof TechnologyTagModel)
            tagLevel = this.tag.level == 'IMPORTANT' ? 'danger' : 'info';

        return `label label-${tagLevel} tag`;
    }

    get tagValue():string {
        if (this.tag instanceof TechnologyTagModel)
            return (<TechnologyTagModel>this.tag).name;
        else
            return this.tag;
    }
}