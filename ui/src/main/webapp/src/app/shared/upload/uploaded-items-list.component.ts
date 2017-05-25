import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";

/**
 * This component is quite hacky way how to show the same visuals as in alternative-upload-queue.
 *
 *  There is nothing common between {RegisteredApplication} entity and {FileItem} used in upload queue,
 *   so no common component between these 2 could simply exist.
 *
 *  There are several possible (more or less hacky) ways how to solve that:
 *
 *   *1) Kind of duplicate what we have in upload queue in other component for existing applications list
 *       This is the approach I choose, since it felt like the simplest one.
 *   2) Have completely generic "parent" queue component with 2 childs - upload queue and existing applications list.
 *      This generic parent component wouldn't really be nice and it wouldn't be easy to modify it for both use cases.
 *   3) Kind of convert RegisteredApplication and FileItem entities into some common entity and have one component
 *      to handle it. This is not really nice, because for file upload we need more data which are not available
 *      in registered application.
 *   4) Have one component which would handle 2 things: RegisteredApplications and upload queue. Lot of code would be duplicated
 *     (or *ngIf would be heavily used there)
 *
 */
@Component({
    selector: 'wu-uploaded-items-list',
    templateUrl: './uploaded-items-list.component.html',
    styleUrls: [
        './alternative-upload-queue.component.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadedItemsListComponent {
    private _getLabel: (item: any) => string;

    @Input()
    public uploadedItemsList: any[] = [];

    @Input()
    public set getLabel(callback: (item: any) => string) {
        if (callback) {
            this._getLabel = callback;
        }
    }

    public get getLabel() {
        return this._getLabel;
    }

    @Output()
    public deleteItem: EventEmitter<any> = new EventEmitter<any>();

    public delete(item: any) {
        this.deleteItem.next(item);
    }
}
