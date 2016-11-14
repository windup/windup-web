import {Injectable} from "@angular/core";
import {
    CanActivate, Router, ActivatedRoute, CanActivateChild, ActivatedRouteSnapshot,
    RouterStateSnapshot
} from "@angular/router";
import {KeycloakService} from "./keycloak.service";
import {Observable} from "rxjs";

@Injectable()
export class LoggedInGuard implements CanActivate, CanActivateChild {
    constructor(
        private _router: Router,
        private _keycloakService: KeycloakService,
        private _activeRoute: ActivatedRoute
    ) {

    }

    canActivate(): Observable<boolean> {
        return this._keycloakService.isLoggedIn();
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.canActivate();
    }
}
