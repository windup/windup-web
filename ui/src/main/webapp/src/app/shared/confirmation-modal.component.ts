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
    template: `
    <div id="{{id}}" class="modal fade" tabindex="-1" role="dialog" [attr.aria-labelledby]="title" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <!--
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                    <span class="pficon pficon-close"></span>
                </button>
                -->
                <h1 class="modal-title" [innerHTML]="(title)"></h1>
            </div>
            <div class="modal-body">
                <p [innerHTML]="(body)"></p>
                <div [style.display]="confirmPhrase ? 'block' : 'none'">
                    <p class="ng-binding">Type the name of the project to confirm.</p>
                    <p>
                        <label class="sr-only" for="resource-to-delete">project to delete</label>
                        <input #confirmInput id="resource-to-delete" xstyle="margin: 1ex 1em" type="text"
                               class="form-control input-lg"
                               autocorrect="off" autocapitalize="off" spellcheck="false" autofocus=""
                               (keyup)="confirmationFieldChanged($event.target.value)"
                        >
                    </p>
                </div>
            </div>
            
            <div class="modal-footer">
                <button type="button" class="confirm-button btn btn-lg {{confirmPhrase ? 'btn-danger' : 'btn-primary'}}" (click)="yes()" [disabled]="!formValid">{{yesLabel}}</button>
                <button type="button" class="cancel-button btn btn-lg btn-default" (click)="no()">{{noLabel}}</button>
            </div>
        </div>
    </div>
</div>
`
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
