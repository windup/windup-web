import {Injectable} from "@angular/core";
import {Constants} from "../../constants";
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router";

import {RouteHistoryService} from "../routing/route-history.service";
import * as Keycloak from "keycloak-js";

type KeycloakClient = Keycloak.KeycloakInstance;

@Injectable()
export class KeycloakService {

    protected auth: any = {};
    protected keyCloak: KeycloakClient;

    protected initObservable: Observable<boolean>;

    protected static KEYCLOAK_FILE = 'keycloak.json';
    protected static TOKEN_MIN_VALIDITY_MINUTES = 5;

    public constructor(private _router: Router, private _history: RouteHistoryService) {
        if (!Keycloak)
            throw new Error("Keycloak class not defined; is Keycloak service running?");

        this.keyCloak = Keycloak(KeycloakService.KEYCLOAK_FILE);
        this.init({ onLoad: Constants.SSO_MODE, checkLoginIframe: false })
            .subscribe((isLoggedIn) => {
                this.onLoginSuccess(isLoggedIn);
            },
                error => console.error('error', error)
            );
    }

    get username(): String {
        if (this.auth.authz) {
            return this.auth.authz.tokenParsed.preferred_username;
        }
    }

    /**
     * Be aware, keycloak doesn't return real promise, but its own implementation.
     * Real promise can be resolved multiple times, but keycloak one just once.
     * This method creates real promise from keycloak one. It should be called on the keycloak promise right away.
     * .success neither or .error should be called on keycloak promise! Use transformed one instead.
     *
     * @param keyCloakPromise
     * @returns {Promise<boolean>}
     */
    protected transformKeycloakPromise(keyCloakPromise: any): Promise<any> {
        return new Promise<boolean>((resolve, error) => {
            keyCloakPromise
                .success((auth) => {
                    resolve(auth);
                })
                .error((failure) => {
                    error(failure)
                });
        });
    }

    protected init(options?): Observable<boolean> {
        let keyCloakPromise = this.keyCloak.init(options);
        let realPromise = this.transformKeycloakPromise(keyCloakPromise);

        realPromise.then(success => true).catch(error => console.error("Keycloak promise error", error));
        this.initObservable = Observable.fromPromise(realPromise);
        return this.initObservable;
    }

    isLoggedIn(): Observable<boolean> {
        return this.initObservable;
    }

    protected getRedirectUrl(): string {
        let redirectUrl = this._history.getPreviousRouteOrDefaultUrl(0, Constants.AUTH_REDIRECT_URL);
        return redirectUrl;
    }

    protected onLoginSuccess(isLoggedIn) {
        if (!isLoggedIn) {
            console.warn('Login success, not logged in');
            this._router.navigateByUrl(this.keyCloak.authServerUrl);
//            this._router.navigate(['/login']);
        } else {
            let redirectUrl = this.getRedirectUrl();

            this.auth.loggedIn = true;
            this.auth.authz = this.keyCloak;
            this.auth.logoutUrl =  this.keyCloak.authServerUrl + "/realms/windup/tokens/logout?redirect_uri=" + redirectUrl;

            this.keyCloak.onAuthLogout = function () {
                this.logout();
            };
            this.keyCloak.onAuthRefreshError = function () {
                console.warn("Auth refresh error!");
                this.logout();
            };
        }

        return isLoggedIn;
    }


    login(): Observable<any> {
        this.auth.loggedIn = false;

        let promise = this.keyCloak.login(<Keycloak.KeycloakLoginOptions>{
            redirectUri: this.getRedirectUrl()
        });

        let realPromise = this.transformKeycloakPromise(promise);
        realPromise
            .then((auth) => this.onLoginSuccess(auth))
            .catch((error) => {
                console.warn(error);
            });

        return Observable.fromPromise(realPromise);
    }

    logout():Observable<{}> {
        let logoutPromise = this.auth.authz.logout();
        logoutPromise = this.transformKeycloakPromise(logoutPromise);
        return Observable.fromPromise(logoutPromise).do(() => {
            this.auth.loggedIn = false;
            this.auth.authz = null;
        });
    }

    getToken(): Observable<string> {
        let promise: Promise<string> = new Promise<string>((resolve, reject) => {
            this.isLoggedIn().subscribe(isLoggedIn => {
                    if (isLoggedIn) {
                        this.keyCloak.updateToken(KeycloakService.TOKEN_MIN_VALIDITY_MINUTES)
                            .success(() => resolve(this.auth.authz.token))
                            .error(error => reject(error));
                    } else {
                        reject('User is not authenticated, token is not set');
                    }
                },
                error => reject(error)
            );
        });

        return Observable.fromPromise(promise);
    }
}
