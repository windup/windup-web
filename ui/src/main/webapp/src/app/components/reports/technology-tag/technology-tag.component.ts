import {Component, Input} from "@angular/core";
import {TechnologyTagModel} from "../../../generated/tsModels/TechnologyTagModel";

@Component({
    selector: 'wu-technology-tag',
    template: `<span [class]="tagClass">{{tag.name}}</span>`
})
export class TechnologyTagComponent {
    @Input()
    tag:TechnologyTagModel;

    get tagClass():string {
        let tagLevel = this.tag.level == 'IMPORTANT' ? 'danger' : 'info';

        return `label label-${tagLevel} tag`;
    }
}