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
    /**
     * CSS id of current dialog
     *
     * @type {string}
     */
    @Input()
    id: string;

    /**
     * HTML code for dialog title
     *
     * @type {string}
     */
    @Input()
    title: string;

    /**
     * HTML code for dialog body
     *
     * @type {string}
     */
    @Input()
    body: string;

    /**
     * Phrase used for deletion dialogs
     * User must type the exact same phrase to proceed
     *
     * @type {string}
     */
    @Input()
    confirmPhrase: string;

    /**
     * Label of 'yes' button
     *
     * @type {string}
     */
    @Input()
    yesLabel: string = "Yes";

    /**
     * Label of 'no' button
     *
     * @type {string}
     */
    @Input()
    noLabel: string = "No";

    /**
     * CSS classes of 'yes' button
     *
     * @type {string}
     */
    @Input()
    public yesClasses = 'btn-danger';

    /**
     * CSS classes of 'no' button
     *
     * @type {string}
     */
    @Input()
    public noClasses = 'btn-default';

    /**
     * Data passed to all dialog events
     *
     */
    @Input()
    public data: any;

    /**
     * Event triggered when 'confirm' button is clicked
     *
     * @type {EventEmitter<any>}
     */
    @Output()
    confirmed = new EventEmitter<any>();

    /**
     * Event triggered when 'cancel' button is clicked
     *
     * @type {EventEmitter<any>}
     */
    @Output()
    cancelled = new EventEmitter<any>();

    /**
     * Event triggered when dialog is closed
     *
     * @type {EventEmitter<DialogResult>}
     */
    @Output()
    closed = new EventEmitter<DialogResult>();

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

    hide(result: boolean = false): void {
        (<any>$('#' + this.id)).modal('hide');
        this.closed.next({
            data: this.data,
            result: result
        });
    }

    yes(): void {
        this.confirmed.emit(this.data);
        this.hide(true);
    }

    no(): void {
        this.cancelled.emit(this.data);
        this.hide(false);
    }
}

export interface DialogResult {
    data: any;
    result: boolean;
}
