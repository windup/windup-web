import {Component, Input} from "@angular/core";
import {RuleProviderEntity} from "windup-services";

@Component({
    selector: 'rules-modal',
    templateUrl: 'app/components/rules-modal.component.html'
})
export class RulesModalComponent {
    @Input()
    ruleProviderEntity:RuleProviderEntity = <RuleProviderEntity>{};

    constructor() {}

    show():void {
        (<any>$('#rulesModal')).modal();
    }
}
