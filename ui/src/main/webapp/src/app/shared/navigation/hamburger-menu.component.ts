import {Component} from "@angular/core";
import {ContextMenuComponent} from "./context-menu.component";

@Component({
    selector: 'wu-hamburger-menu',
    templateUrl: './hamburger-menu.component.html',
    styleUrls: ['./hamburger-menu.component.scss']
})
export class HamburgerMenuComponent extends ContextMenuComponent{

}

export const DEFAULT_MENU_ITEMS = [
    {
        label: 'Rules Configuration',
        link: '/configuration',
        icon: '',
        isEnabled: true
    },
    {
        label: 'Documentation',
        link: 'https://access.redhat.com/documentation/en/red-hat-application-migration-toolkit/',
        absolute: true,
        icon: '',
        isEnabled: true

    },
    {
        label: 'About',
        link: '/about',
        icon: '',
        isEnabled: true
    },
    {
        label: 'Logout',
        link: '', // TODO: How to trigger logout?
        absolute: false,
        icon: '',
        isEnabled: true
    },
];
