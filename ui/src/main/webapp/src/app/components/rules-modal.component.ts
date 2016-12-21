import {Component, Input} from "@angular/core";
import * as $ from "jquery";
import {RuleProviderEntity} from "windup-services";

@Component({
    selector: 'rules-modal',
    templateUrl: 'rules-modal.component.html'
})
export class RulesModalComponent {
    @Input()
    ruleProviderEntity: RuleProviderEntity|any = <RuleProviderEntity>{};
    // TODO: This is workaround, without |any it would not find 'windup-services' module

    constructor() {}

    show():void {
        (<any>$('#rulesModal')).modal();
    }
}
