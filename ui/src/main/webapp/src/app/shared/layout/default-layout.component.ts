import {Component} from "@angular/core";
import {DEFAULT_MENU_ITEMS} from "../navigation/hamburger-menu.component";

@Component({
    templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent {
    public navigationMenuItems = DEFAULT_MENU_ITEMS;
}
