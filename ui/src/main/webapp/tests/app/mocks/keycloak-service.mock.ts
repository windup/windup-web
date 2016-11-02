import {Observable} from "rxjs/Observable";
import {KeycloakService} from "../../../src/app/services/keycloak.service";

export class KeyCloakServiceMock /* extends KeycloakService */ {
    public constructor() {
        // super(null);
    }


    get username(): String {
        return 'username';
    }

    protected init(options?): Observable<boolean> {
        return new Observable<boolean>(observer => {
            observer.next(true);
            observer.complete();
        });
    }

    isLoggedIn(): Observable<boolean> {
        return new Observable<boolean>(observer => {
            observer.next(true);
            observer.complete();
        });
    }

    protected onLoginSuccess(isLoggedIn) {
        return true;
    }


    login(): Observable<any> {
        return new Observable<boolean>(observer => {
            observer.next(true);
            observer.complete();
        });
    }

    logout() {
    }

    getToken(): Observable<string> {
        return new Observable<string>(observer => {
            observer.next('token');
            observer.complete();
        });
    }

    protected createRefreshInterval() {
    }
}
