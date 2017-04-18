import {Component, EventEmitter, Inject, Input, Output} from "@angular/core";
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
                {{body}}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn" [ngClass]="noClasses" (click)="no()">No</button>
                <button type="button" class="btn" [ngClass]="yesClasses" (click)="yes()">Yes</button>
            </div>
        </div>
    </div>
</div>
`
})
export class ConfirmationModalComponent {
    @Input()
    id:string;

    @Input()
    title:string;

    @Input()
    body:string;

    @Input()
    public data: any;

    @Output()
    confirmed = new EventEmitter();

    @Output()
    cancelled = new EventEmitter();

    @Input()
    public yesClasses = 'btn-danger';

    @Input()
    public noClasses = 'btn-default';

    constructor() {}

    show():void {
        (<any>$('#' + this.id)).modal('show');
    }

    hide():void {
        (<any>$('#' + this.id)).modal('hide');
    }

    yes():void {
        this.confirmed.emit({data: this.data});
        this.hide();
    }

    no():void {
        this.cancelled.emit({data: this.data});
        this.hide();
    }
}
