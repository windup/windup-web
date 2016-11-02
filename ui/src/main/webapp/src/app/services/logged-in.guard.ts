import {Injectable} from "@angular/core";
import {CanActivate, Router, ActivatedRoute} from "@angular/router";
import {KeycloakService} from "./keycloak.service";
import {Observable} from "rxjs";

@Injectable()
export class LoggedInGuard implements CanActivate {
    constructor(
        private _router: Router,
        private _keycloakService: KeycloakService,
        private _activeRoute: ActivatedRoute
    ) {

    }

    canActivate(): Observable<boolean> {
        return this._keycloakService.isLoggedIn();
    }
}
