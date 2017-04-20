import {Component, EventEmitter, Input, Output} from "@angular/core";
import * as $ from "jquery";

@Component({
    selector: 'wu-confirmation-modal',
    styles: [`
        .modal-dialog {
            width: 640px;
            margin: 30px auto;
        }
        h1 {
            font-size: 21px;
            font-weight: 500;
            margin-bottom: 20px;
            overflow-wrap: break-word;
            min-width: 0;
        }
        p { font-size: 16px; }
    `],
    templateUrl: './confirmation-modal.component.html'
})
export class ConfirmationModalComponent {
    @Input()
    id: string;

    @Input()
    title: string;

    @Input()
    body: string;

    @Input()
    confirmPhrase: string;

    @Input()
    yesLabel: string = "Yes";

    @Input()
    noLabel: string = "No";

    @Input()
    public data: any;

    @Output()
    confirmed = new EventEmitter();

    @Output()
    cancelled = new EventEmitter();

    typedConfirmationPhrase: string = "";

    constructor() {}

    confirmationFieldChanged(newValue: string) {
        this.typedConfirmationPhrase = newValue;
    }

    get formValid (): boolean {
        if (!this.confirmPhrase)
            return true;

        if (!this.typedConfirmationPhrase)
            return false;


        return this.confirmPhrase.trim().toLocaleLowerCase() == this.typedConfirmationPhrase.trim().toLocaleLowerCase();
    }

    show(): void {
        (<any>$('#' + this.id)).modal('show');
    }

    hide(): void {
        (<any>$('#' + this.id)).modal('hide');
    }

    yes():void {
        this.confirmed.emit(this.data);
        this.hide();
    }

    no():void {
        this.cancelled.emit(this.data);
        this.hide();
    }
}
