import {
    HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
    HttpResponse
} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {EventBusService} from "../events/event-bus.service";
import {
    LoadingSomethingFailedEvent, LoadingSomethingFinishedEvent,
    LoadingSomethingStartedEvent
} from "../events/windup-event";
import {Injectable} from "@angular/core";

/**
 * Intercepts all http requests and updates loading indicator
 */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    constructor(private _eventBus: EventBusService) {
    }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this._eventBus.fireEvent(new LoadingSomethingStartedEvent(this));

        return next.handle(request).do(event => {
            if (event instanceof HttpResponse) {
                this._eventBus.fireEvent(new LoadingSomethingFinishedEvent(event, this));
            }
        }).catch(response => {
            if (response instanceof HttpErrorResponse) {
                this._eventBus.fireEvent(new LoadingSomethingFailedEvent(response, this));
            }

            return Observable.throw(response);
        });
    }
}
