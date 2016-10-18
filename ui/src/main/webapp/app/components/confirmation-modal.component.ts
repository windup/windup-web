import {Component, EventEmitter, Inject, Input, Output} from "@angular/core";
import $ from 'jquery';

@Component({
    selector: 'confirmation-modal',
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
                <button type="button" class="btn btn-default" (click)="no($event)">No</button>
                <button type="button" class="btn btn-default" (click)="yes($event)">Yes</button>
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

    @Output()
    confirmed = new EventEmitter();

    @Output()
    cancelled = new EventEmitter();

    constructor() {}

    show(event:Event):void {
        event.preventDefault();
        (<any>$('#' + this.id)).modal('show');
    }

    hide(event:Event):void {
        event.preventDefault();
        (<any>$('#' + this.id)).modal('hide');
    }

    yes(event:Event):void {
        this.confirmed.emit({});
        this.hide(event);
    }

    no(event:Event):void {
        this.cancelled.emit({});
        this.hide(event);
    }
}
