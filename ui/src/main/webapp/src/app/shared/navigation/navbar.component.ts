import {Component, OnInit, ElementRef} from '@angular/core';
import {KeycloakService} from "../../core/authentication/keycloak.service";
import * as $ from 'jquery';
import 'bootstrap';

@Component({
    selector: 'wu-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    constructor(private _keycloak: KeycloakService, private _element: ElementRef) {

    }

    ngOnInit(): void {
        $(this._element.nativeElement).find('.dropdown-toggle').dropdown();
    }

    get username(): String {
        return this._keycloak.username;
    }

    logout(event:Event):void {
        event.preventDefault();
        this._keycloak.logout();
    }
}
