import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {KeycloakService} from "./keycloak.service";
import {Injectable} from "@angular/core";

/**
 * Intercepts all http requests and add auth token
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private _keycloakService: KeycloakService) {
    }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this._keycloakService.getToken().flatMap((token: string) => {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });

            return next.handle(request);
        });
    }
}
