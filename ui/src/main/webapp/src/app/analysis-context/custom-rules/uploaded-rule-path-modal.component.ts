import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RuleProviderEntity } from '../../generated/windup-services';

@Component({
    selector: 'wu-uploaded-rule-path-modal',
    templateUrl: './uploaded-rule-path-modal.component.html'
})
export class UploadedRulePathModalComponent {

    ruleProvider: RuleProviderEntity;

    constructor(
        public bsModalRef: BsModalRef
    ) { }

}
