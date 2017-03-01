import {Component, OnInit, ElementRef} from '@angular/core';
import {Router} from "@angular/router";
import {KeycloakService} from "../../core/authentication/keycloak.service";
import * as $ from 'jquery';
import 'bootstrap';

@Component({
    selector: 'wu-navbar',
    templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
    constructor(private _keycloak:KeycloakService, private _router:Router, private _element: ElementRef) {

    }

    ngOnInit(): void {
        $(this._element.nativeElement).find('.dropdown-toggle').dropdown();
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
