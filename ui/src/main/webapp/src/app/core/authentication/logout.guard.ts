import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from "@angular/router";
import {KeycloakService} from "./keycloak.service";

/**
 * This is kind of workaround for logout procedure
 *
 * Logout needs to call KeycloakService.logout method.
 *
 * To avoid injecting KeycloakService into all components which need to do that,
 * I created 'logout' route with this guard. Component can simply navigate to 'logout' route,
 * this guard will run and do logout logic.
 *
 */
@Injectable()
export class LogoutGuard implements CanActivate, CanActivateChild {
    constructor(
        private _router: Router,
        private _keycloakService: KeycloakService
    ) {

    }

    canActivate(): boolean {
        this._keycloakService.logout();
        this._router.navigate(['/']);

        return false;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate();
    }
}
