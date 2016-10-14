import {Injectable} from '@angular/core';
import {Constants} from "../constants";
import {Observable} from 'rxjs/Observable';

declare var Keycloak: any;

@Injectable()
export class KeycloakService {

    static auth : any = {};

    get username():String {
        if (KeycloakService.auth.authz)
            return KeycloakService.auth.authz.tokenParsed.name;
    }

    static init() : Promise<any> {
        return KeycloakService.initWithKeycloakJSONPath('keycloak.json');
    }

    static initWithKeycloakJSONPath(path:string) {
        let keycloakAuth : any = new Keycloak(path);
        KeycloakService.auth.loggedIn = false;

        return new Promise((resolve,reject)=>{
            keycloakAuth.init({ onLoad: 'check-sso' })
                .success( (auth) => {
                    if (!auth) {
                        window.location.href = Constants.UNAUTHENTICATED_PAGE;
                        return;
                    }
                    KeycloakService.auth.loggedIn = true;
                    KeycloakService.auth.authz = keycloakAuth;
                    KeycloakService.auth.logoutUrl = keycloakAuth.authServerUrl + "/realms/windup/tokens/logout?redirect_uri=http://localhost:8080/windup-web";
                    keycloakAuth.onAuthLogout = function () {
                        console.log("Logout event received!");
                        KeycloakService.logout();
                    };
                    keycloakAuth.onAuthRefreshError = function () {
                        console.log("Auth refresh error!");
                        KeycloakService.logout();
                    };
                    resolve(null);
                })
                .error(()=> {
                    reject(null);
                });
        });
    }

    static logout() {
        console.log('*** LOGOUT');
        KeycloakService.auth.authz.logout();
        KeycloakService.auth.loggedIn = false;
        KeycloakService.auth.authz = null;
    }

    getToken(): Observable<string> {
        let promise:Promise<string> = new Promise<string>((resolve,reject)=>{
            if (KeycloakService.auth.authz.token) {
                KeycloakService.auth.authz.updateToken(5).success(function() {
                    let token = <string>KeycloakService.auth.authz.token;
                    resolve(token);
                })
                .error(function() {
                    reject('Failed to refresh token');
                });
            }
        });

        return Observable.fromPromise(promise);
    }
}