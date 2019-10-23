import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { LabelProviderEntity } from '../../generated/windup-services';

@Component({
    selector: 'wu-uploaded-label-path-modal',
    templateUrl: './uploaded-label-path-modal.component.html'
})
export class UploadedLabelPathModalComponent {

    labelProvider: LabelProviderEntity;

    constructor(
        public bsModalRef: BsModalRef
    ) { }

}
