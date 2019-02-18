import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";

/**
* Intercepts all http requests and add auth token
*/
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError(response => {
                    if (response instanceof HttpErrorResponse) {
                        console.error("Service error: ", response);
                    }
                    return Observable.throw(response);
                })
            );
    }
}