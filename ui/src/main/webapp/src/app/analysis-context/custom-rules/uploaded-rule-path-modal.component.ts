import { Component, AfterViewChecked } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RuleProviderEntity } from '../../generated/windup-services';

declare function prettyPrint();

@Component({
    selector: 'wu-uploaded-rule-path-modal',
    templateUrl: './uploaded-rule-path-modal.component.html',
    styleUrls: ['./uploaded-rule-path-modal.component.scss']
})
export class UploadedRulePathModalComponent implements AfterViewChecked {

    ruleProvider: RuleProviderEntity;

    constructor(public bsModalRef: BsModalRef) {

    }

    ngAfterViewChecked() {
        prettyPrint();
    }

    getLabelForRuleID(ruleID: string, providerID: string, i: number) {
        return (ruleID.length > 0 ? ruleID : providerID + "_" + (i + 1));
    }

}
