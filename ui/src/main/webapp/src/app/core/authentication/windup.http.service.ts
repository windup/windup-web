import {Injectable} from "@angular/core";
import {Http, Request, ConnectionBackend, RequestOptions, RequestOptionsArgs, Response, Headers} from "@angular/http";

import {KeycloakService} from "./keycloak.service";
import {Observable} from 'rxjs/Observable';

@Injectable()
export class WindupHttpService extends Http {
    constructor(_backend: ConnectionBackend, _defaultOptions: RequestOptions, private _keycloakService:KeycloakService) {
        super(_backend, _defaultOptions);
    }

    private setToken(options: RequestOptionsArgs): Observable<RequestOptionsArgs> {
        return new Observable<RequestOptionsArgs>(observer => {
            this._keycloakService.getToken().subscribe(
                token => {
                    if (!options.hasOwnProperty('headers')) {
                        options.headers = new Headers();
                    }

                    if (!options.headers.has('Authorization')) {
                        options.headers.set('Authorization', 'Bearer ' + token);
                    }

                    observer.next(options);
                    observer.complete();
                },
                error => {
                    console.log("Need a token, but no token is available, not setting bearer token.");
                    observer.error(error);
                }
            )
        });
    }

    private configureRequest(f:Function, url:string | Request, options:RequestOptionsArgs = {}, body?: any): Observable<Response> {
        return (this.setToken(options) as Observable<Response>).flatMap(options => {
            return new Observable<Response>((observer) => {
                let result;
                if (body) {
                    result = f.apply(this, [url, body, options]);
                } else {
                    result = f.apply(this, [url, options]);
                }

                result.subscribe(
                    response => observer.next(response),
                    error => observer.error(error),
                    complete => observer.complete()
                );
            });
        });
    }

    /**
     * Performs any type of http request. First argument is required, and can either be a url or
     * a {@link Request} instance. If the first argument is a url, an optional {@link RequestOptions}
     * object can be provided as the 2nd argument. The options object will be merged with the values
     * of {@link BaseRequestOptions} before performing the request.
     */
    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.configureRequest(super.request, url, options);
    }

    /**
     * Performs a request with `get` http method.
     */
    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.configureRequest(super.get, url, options);
    }

    /**
     * Performs a request with `post` http method.
     */
    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.configureRequest(super.post, url, options, body);
    }

    /**
     * Performs a request with `put` http method.
     */
    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.configureRequest(super.put, url, options, body);
    }

    /**
     * Performs a request with `delete` http method.
     */
    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.configureRequest(super.delete, url, options);
    }

    /**
     * Performs a request with `patch` http method.
     */
    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.configureRequest(super.patch, url, options, body);
    }

    /**
     * Performs a request with `head` http method.
     */
    head(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.configureRequest(super.head, url, options);
    }

    /**
     * Performs a request with `options` http method.
     */
    options(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.configureRequest(super.options, url, options);
    }
}
