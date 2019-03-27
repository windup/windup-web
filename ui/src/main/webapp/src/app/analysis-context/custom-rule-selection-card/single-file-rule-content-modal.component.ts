import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'wu-single-file-rule-content-modal',
    templateUrl: './single-file-rule-content-modal.component.html',
    styleUrls: ['./single-file-rule-content-modal.component.scss']
})
export class SingleFileRuleContentModalComponent {

    constructor(public bsModalRef: BsModalRef) {

    }
    
}
