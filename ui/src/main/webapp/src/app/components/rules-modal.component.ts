import {Component, Input} from "@angular/core";
import {RuleProviderEntity} from "windup-services";
import $ from 'jquery';

@Component({
    selector: 'rules-modal',
    templateUrl: 'rules-modal.component.html'
})
export class RulesModalComponent {
    @Input()
    ruleProviderEntity:RuleProviderEntity = <RuleProviderEntity>{};

    constructor() {}

    show():void {
        (<any>$('#rulesModal')).modal();
    }
}
