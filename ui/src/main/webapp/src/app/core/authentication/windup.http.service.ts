import {Injectable} from "@angular/core";
import {
    Http, Request, ConnectionBackend, RequestOptions, RequestOptionsArgs, Response, Headers,
    RequestMethod
} from "@angular/http";

import {KeycloakService} from "./keycloak.service";
import {Observable} from 'rxjs/Observable';
import {EventBusService} from "../events/event-bus.service";
import {LoadingSomethingFinishedEvent, LoadingSomethingStartedEvent} from "../events/windup-event";

@Injectable()
export class WindupHttpService extends Http {
    constructor(
        _backend: ConnectionBackend,
        _defaultOptions: RequestOptions,
        private _keycloakService: KeycloakService,
        private _eventBus: EventBusService,
    ) {
        super(_backend, _defaultOptions);
    }

    private setToken(options: RequestOptionsArgs): Observable<RequestOptionsArgs> {
        return new Observable<RequestOptionsArgs>(observer => {
            this._keycloakService.getToken().subscribe(
                token => {
                    if (!options.hasOwnProperty('headers') || options.headers == null) {
                        options.headers = new Headers();
                    }

                    options.headers.set('Authorization', 'Bearer ' + token);

                    observer.next(options);
                    observer.complete();
                },
                error => {
                    console.warn("Need a token, but no token is available, not setting bearer token.");
                    observer.error(error);
                }
            )
        });
    }

    private configureRequest(method: RequestMethod, f: Function, url: string | Request, options: RequestOptionsArgs = {}, body?: any): Observable<Response> {
        let responseObservable: Observable<Response> = (this.setToken(options) as Observable<Response>).flatMap(options => {
            return new Observable<Response>((observer) => {
                let bodyRequired = false;
                if (method != null) {
                    switch (method) {
                        case RequestMethod.Post:
                        case RequestMethod.Put:
                        case RequestMethod.Patch:
                            bodyRequired = true;
                            break;
                        default:
                            bodyRequired = false;
                    }
                }

                let result;
                if (bodyRequired) {
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

        let responseObservable2 = responseObservable.do(
            () => console.log("Request SUCCEEDED"),
            () => console.log("Request FAILED"),
            () => {
                console.log("Request FINISHED");
                if (this._eventBus) {
                    console.log("Request FINISHED, firing");
                    this._eventBus.fireEvent(new LoadingSomethingFinishedEvent(responseObservable))
                }
            }
        );

        console.log("Load STARTED");
        if (this._eventBus)
            console.log("Load STARTED, firing");
        this._eventBus.fireEvent(new LoadingSomethingStartedEvent(responseObservable));


        return responseObservable2;
    }

    /**
     * Performs any type of http request. First argument is required, and can either be a url or
     * a {@link Request} instance. If the first argument is a url, an optional {@link RequestOptions}
     * object can be provided as the 2nd argument. The options object will be merged with the values
     * of {@link BaseRequestOptions} before performing the request.
     */
    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.configureRequest(null, super.request, url, options);
    }

    /**
     * Performs a request with `get` http method.
     */
    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.configureRequest(RequestMethod.Get, super.get, url, options);
    }

    /**
     * Performs a request with `post` http method.
     */
    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.configureRequest(RequestMethod.Post, super.post, url, options, body);
    }

    /**
     * Performs a request with `put` http method.
     */
    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.configureRequest(RequestMethod.Put, super.put, url, options, body);
    }

    /**
     * Performs a request with `delete` http method.
     */
    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.configureRequest(RequestMethod.Delete, super.delete, url, options);
    }

    /**
     * Performs a request with `patch` http method.
     */
    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.configureRequest(RequestMethod.Patch, super.patch, url, options, body);
    }

    /**
     * Performs a request with `head` http method.
     */
    head(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.configureRequest(RequestMethod.Head, super.head, url, options);
    }

    /**
     * Performs a request with `options` http method.
     */
    options(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.configureRequest(RequestMethod.Options, super.options, url, options);
    }
}
