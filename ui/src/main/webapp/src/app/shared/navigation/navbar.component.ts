import {Component, OnInit, ElementRef, Input, AfterViewInit} from '@angular/core';
import {KeycloakService} from "../../core/authentication/keycloak.service";
import * as $ from 'jquery';
import 'bootstrap';

@Component({
    selector: 'wu-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss', './navigation-responsive-styles.scss']
})
export class NavbarComponent implements AfterViewInit {
    @Input()
    public showMenuItems: boolean = true;

    @Input()
    public showLogotype: boolean = true;

    constructor(private _keycloak: KeycloakService, private _element: ElementRef) {

    }

    ngAfterViewInit(): void {
        $(this._element.nativeElement).find('.dropdown-toggle').dropdown();
    }

    get username(): String {
        return this._keycloak.username;
    }
    
    redirectToPF4(): void {
        window.location.replace(`${window.location.origin}/mta-ui`);
    }
}
