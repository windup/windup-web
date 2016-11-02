import {Component, OnInit} from "@angular/core";
import {KeycloakService} from "../services/keycloak.service";
import {Router} from "@angular/router";

@Component({
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    constructor(private _keyCloakService: KeycloakService, private _router: Router) {
    }

    ngOnInit(): void {
        this._keyCloakService.isLoggedIn().subscribe((isLoggedIn) => {
            console.log('is logged in?', isLoggedIn);
            if (isLoggedIn) {
                this._router.navigate(['']);
            }
        })
    }

    login() {
        this._keyCloakService.login();
    }
}
