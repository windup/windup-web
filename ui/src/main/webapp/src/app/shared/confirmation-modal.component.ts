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
                               (keyup)="yes.disabled = (confirmPhrase && ($event.target.value.trim().toLowerCase() != confirmPhrase.trim().toLowerCase()))"
                        >
                    </p>
                </div>
            </div>
            
            <div class="modal-footer">
                <button #no  type="button" class="btn btn-lg btn-default" (click)="clickedNo()">{{noLabel}}</button>
                <button #yes type="button" class="btn btn-lg {{confirmPhrase ? 'btn-danger' : 'btn-primary'}}" (click)="clickedYes()" disabled="{{confirmPhrase}}">{{yesLabel}}</button>
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

    unescapeHTML(input) {
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }
}
