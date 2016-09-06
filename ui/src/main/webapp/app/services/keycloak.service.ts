import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Constants} from "../constants";

declare var Keycloak: any;

@Injectable()
export class KeycloakService {

    static auth : any = {};

    private _defaultHeaders:Headers;

    get username():String {
        if (KeycloakService.auth.authz)
            return KeycloakService.auth.authz.tokenParsed.name;
    }

    get defaultHeaders():Headers {
        if (KeycloakService.auth.authz.token) {
            return new Headers({
                'Authorization': 'Bearer ' + KeycloakService.auth.authz.token
            });
        } else {
            return new Headers();
        }
    }

    static init() : Promise<any>{
        let keycloakAuth : any = new Keycloak('keycloak.json');
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
                    resolve(null);
                })
                .error(()=> {
                    reject(null);
                });
        });
    }

    logout(){
        console.log('*** LOGOUT');
        KeycloakService.auth.authz.logout();
        KeycloakService.auth.loggedIn = false;
        KeycloakService.auth.authz = null;
    }

    getToken(): Promise<string>{
        return new Promise<string>((resolve,reject)=>{
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
    }
}