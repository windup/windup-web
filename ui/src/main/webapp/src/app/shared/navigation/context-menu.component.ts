import {Component, Input, ChangeDetectionStrategy} from "@angular/core";
import {ContextMenuItemInterface} from "./context-menu-item.class";
import {Router} from "@angular/router";

@Component({
    selector: 'wu-context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent {
    protected _menuItems: ContextMenuItemInterface[] = [];
    protected enabledItems: ContextMenuItemInterface[] = [];

    constructor(private _router: Router) {
    }

    @Input()
    public set menuItems(items: ContextMenuItemInterface[]) {
        if (!items) {
            items = [];
        }

        this._menuItems = items;
        this.enabledItems = this._menuItems.filter(item => item.isEnabled);
    }

    click(item: ContextMenuItemInterface) {
        if (item.action) {
            item.action();
        } else {
            let link = this.getLink(item);

            if (item.data) {
                this._router.navigate([link, item.data]);
            } else {
                this._router.navigate([link]);
            }
        }
    }

    getLink(item: ContextMenuItemInterface) {
        if (typeof item.link === 'function') {
            return item.link();
        } else {
            return item.link;
        }
    }
}
