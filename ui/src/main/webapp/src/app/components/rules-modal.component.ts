import {Component, Input} from "@angular/core";
import * as $ from "jquery";
import {RuleProviderEntity} from "windup-services";

declare function prettyPrint();

@Component({
    selector: 'wu-rules-modal',
    templateUrl: 'rules-modal.component.html'
})
export class RulesModalComponent {
    @Input()
    ruleProviderEntity: RuleProviderEntity|any = <RuleProviderEntity>{};
    // TODO: This is workaround, without |any it would not find 'windup-services' module

    constructor() {}

    show():void {
        (<any>$('#rulesModal')).modal();
        // I can't figure out how to make this call prettyPrint() when it's shown.
        prettyPrint(); // This is too soon, it's not rendered yet.
        setTimeout(() => prettyPrint(), 1000);
    }

    prettyPrint() {
        if (!this['prettyPrinted'])
            prettyPrint(),
            this['prettyPrinted'] = true;
    }
}
