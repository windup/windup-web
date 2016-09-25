import {Component, ElementRef} from '@angular/core';
import {Router} from "@angular/router";
import {KeycloakService} from "../services/keycloak.service";

@Component({
    selector: 'navbar',
    templateUrl: './navbar.component.html'
})
export class NavbarComponent {
    constructor(private _keycloak:KeycloakService, private _router:Router) {

    }

    get username():String {
        return this._keycloak.username;
    }

    logout(event:Event):void {
        event.preventDefault();
        this._keycloak.logout();
    }

    isActive(link:HTMLAnchorElement):boolean {
        if (link == null)
            return false;

        let linkAttribute = link.attributes.getNamedItem("routerLink");
        if (linkAttribute == null)
            return false;

        return linkAttribute.value == this._router.url;
    }
}