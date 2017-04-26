import {Injectable} from "@angular/core";
import {ConfirmationModalComponent} from "./confirmation-modal.component";

@Injectable()
export class DialogService {
    private _confirmationDialog: ConfirmationModalComponent;

    setConfirmationDialog(value: ConfirmationModalComponent) {
        this._confirmationDialog = value;
    }

    getConfirmationDialog(): ConfirmationModalComponent {
        return this._confirmationDialog;
    }
}
