import { Component, Input } from "@angular/core";
import { RuleProviderEntity, RulesPath } from "../../generated/windup-services";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
    selector: 'wu-server-path-rules-modal',
    templateUrl: './server-path-rules-modal.component.html',
    styleUrls: ['./server-path-rules-modal.component.scss']
})
export class ServerPathRulesModalComponent {

    @Input() rulePath: RulesPath;
    _ruleProviders: RuleProviderEntity[];

    constructor(public bsModalRef: BsModalRef) { }

    get ruleProviders(): RuleProviderEntity[] {
        return this._ruleProviders;
    }

    @Input()
    set ruleProviders(ruleProviders: RuleProviderEntity[]) {
        if (ruleProviders !== undefined && ruleProviders != null) {
            this._ruleProviders = ruleProviders.filter(r => r.loadError == null);
        }
    }
}