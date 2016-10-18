import {Component, Input} from "@angular/core";
import * as $ from "jquery";
window['jQuery'] = $; // ugly hack, bootstrap cannot consume jQuery as dependency
import 'bootstrap';

var modalID = 0;

@Component({
    selector: 'modal-dialog',
    template: `
    <div id="{{id}}" class="modal fade" tabindex="-1" role="dialog" [attr.aria-labelledby]="title" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                        <span class="pficon pficon-close"></span>
                    </button>
                    <h4 class="modal-title">
                        <ng-content select="[header]"></ng-content>
                    </h4>
                </div>
                <div class="modal-body">
                    <ng-content select="[body]"></ng-content>
                </div>
                <div class="modal-footer">
                    <ng-content select="[footer]"></ng-content>
                </div>
            </div>
        </div>
    </div>
`
})
export class ModalDialogComponent {

    @Input()
    id = `modal-${modalID++}`;

    constructor() {}

    show(): void {
        $(`#${this.id}`).modal('show');
    }

    hide(): void {
        $(`#${this.id}`).modal('hide');
    }
}
