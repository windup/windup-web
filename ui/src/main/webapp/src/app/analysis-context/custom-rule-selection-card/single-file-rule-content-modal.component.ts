import { Component, AfterViewChecked } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RuleProviderEntity } from '../../generated/windup-services';

declare function prettyPrint();

@Component({
    selector: 'wu-single-file-rule-content-modal',
    templateUrl: './single-file-rule-content-modal.component.html',
    styleUrls: ['./single-file-rule-content-modal.component.scss']
})
export class SingleFileRuleContentModalComponent implements AfterViewChecked {

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
