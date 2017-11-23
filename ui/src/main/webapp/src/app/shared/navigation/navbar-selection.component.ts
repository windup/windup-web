import {Output, Input, EventEmitter, Component, ChangeDetectionStrategy} from "@angular/core";
import {utils} from "../utils";
import isFunction = utils.isFunction;

type LabelCallback = (item: any) => string;

@Component({
    selector: '[wu-navbar-selection]',
    templateUrl: './navbar-selection.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: [ './navbar-selection.component.scss' ]
})
export class NavbarSelectionComponent {
    private _items: any[];
    private _getItemLabel: LabelCallback = item => item;
    private _getItemRoute: LabelCallback = item => null;

    @Input()
    public selectedItem: any;

    @Output()
    public selectedItemChange = new EventEmitter<any>();

    @Input()
    public label: string;

    @Input()
    public set items(items: any[]) {
        this._items = items || [];
    }

    public get items(): any[] {
        return this._items;
    }

    @Input()
    public set getItemLabel(callback: LabelCallback) {
        if (callback && isFunction(callback)) {
            this._getItemLabel = callback;
        }
    }

    public get getItemLabel(): LabelCallback {
        return this._getItemLabel;
    }

    @Input()
    public set getItemRoute(callback: LabelCallback) {
        if (callback && isFunction(callback)) {
            this._getItemRoute = callback;
        }
    }

    public get getItemRoute(): LabelCallback {
        return this._getItemRoute;
    }

    public selectItem(item: any) {
        this.selectedItem = item;
        this.selectedItemChange.emit(item);
    }
}
