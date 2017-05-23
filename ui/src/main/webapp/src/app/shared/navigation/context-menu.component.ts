import {Component, Input, ChangeDetectionStrategy} from "@angular/core";
import {ContextMenuItemInterface} from "./context-menu-item.class";

@Component({
    selector: 'wu-context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.scss', './navigation-responsive-styles.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent {
    protected _menuItems: ContextMenuItemInterface[] = [];
    enabledItems: ContextMenuItemInterface[] = [];

    @Input()
    public set menuItems(items: ContextMenuItemInterface[]) {
        if (!items) {
            items = [];
        }

        this._menuItems = items;
        this.enabledItems = this._menuItems.filter(item => item.isEnabled);
    }
}
