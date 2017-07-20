import {Injectable} from "@angular/core";
import {
    CanActivate, Router, ActivatedRoute, CanActivateChild, ActivatedRouteSnapshot,
    RouterStateSnapshot
} from "@angular/router";
import {KeycloakService} from "./keycloak.service";
import {Observable} from "rxjs";
import {UrlCleanerService} from "../routing/url-cleaner.service";

@Injectable()
export class LoggedInGuard implements CanActivate, CanActivateChild {
    constructor(
        private _router: Router,
        private _keycloakService: KeycloakService,
        private _activeRoute: ActivatedRoute,
        private _urlCleanerService: UrlCleanerService
    ) {

    }

    canActivate(): Observable<boolean> {
        return this._keycloakService.isLoggedIn();
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        let cleanedUrl = state.url;
        cleanedUrl = this._urlCleanerService.filterQueryParams(cleanedUrl, UrlCleanerService.SKIP_PARAMS);
        cleanedUrl = this._urlCleanerService.filterFragments(cleanedUrl, UrlCleanerService.SKIP_PARAMS);

        if (cleanedUrl !== state.url) {
            this._router.navigate([cleanedUrl]);
        }

        return this.canActivate();
    }
}
