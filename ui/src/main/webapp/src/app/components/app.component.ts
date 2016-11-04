import {Component, OnInit} from '@angular/core';
import '../rxjs-operators';
import {KeycloakService} from "../services/keycloak.service";

@Component({
    selector: 'windup-app',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    isUserLoggedIn: boolean;

    constructor(private _keycloakService: KeycloakService) {

    }


    ngOnInit(): void {
        this._keycloakService.isLoggedIn().subscribe(isLoggedIn => this.isUserLoggedIn = isLoggedIn);
    }
}
