import {Component, Input, AfterViewInit} from "@angular/core";
import * as $ from "jquery";
import {RuleProviderEntity} from "../generated/windup-services";

declare function prettyPrint();

@Component({
    selector: 'wu-rules-modal',
    templateUrl: 'rules-modal.component.html'
})
export class RulesModalComponent {
    @Input()
    ruleProviderEntity: RuleProviderEntity = <RuleProviderEntity>{};

    show(): void {
        (<any>$('#rulesModal')).modal();
        setTimeout(() => prettyPrint(), 1000);
    }
}
