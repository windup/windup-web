import {Component, EventEmitter, Input, Output} from "@angular/core";
import * as $ from "jquery";

@Component({
    selector: 'wu-confirmation-modal',
    template: `
    <div id="{{id}}" class="modal fade" tabindex="-1" role="dialog" [attr.aria-labelledby]="title" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                    <span class="pficon pficon-close"></span>
                </button>
                <h4 class="modal-title">
                    {{title}}
                </h4>
            </div>
            <div class="modal-body">
                <p>{{body}}</p>
                <p [style.display]="confirmPhrase ? 'block' : 'none'">
                    <input #confirmInput style="margin: 1ex 1em" type="text"
                       (keyup)="yes.disabled = (confirmPhrase && ($event.target.value.trim().toLowerCase() != confirmPhrase.trim().toLowerCase()))" >
                </p>
            </div>
            
            <div class="modal-footer">
                <button #no  type="button" class="btn btn-default" (click)="clickedNo()">{{noLabel}}</button>
                <button #yes type="button" class="btn btn-default" (click)="clickedYes()">{{yesLabel}}</button>
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

    constructor() {}

    show(): void {
        (<any>$('#' + this.id)).modal('show');
    }

    hide(): void {
        (<any>$('#' + this.id)).modal('hide');
    }

    clickedYes(): void {
        this.confirmed.emit({data: this.data});
        this.hide();
    }

    clickedNo(): void {
        this.cancelled.emit({data: this.data});
        this.hide();
    }
}
