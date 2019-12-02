import { Component, Input } from "@angular/core";
import { LabelProviderEntity, LabelsPath } from "../../../../generated/windup-services";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
    selector: 'wu-server-path-labels-modal',
    templateUrl: './server-path-labels-modal.component.html',
    styleUrls: []
})
export class ServerPathLabelsModalComponent {

    @Input() labelPath: LabelsPath;
    _labelProviders: LabelProviderEntity[];

    constructor(public bsModalRef: BsModalRef) { }

    get labelProviders(): LabelProviderEntity[] {
        return this._labelProviders;
    }

    @Input()
    set labelProviders(labelProviders: LabelProviderEntity[]) {
        if (labelProviders !== undefined && labelProviders != null) {
            this._labelProviders = labelProviders.filter(r => r.loadError == null);
        }
    }
}