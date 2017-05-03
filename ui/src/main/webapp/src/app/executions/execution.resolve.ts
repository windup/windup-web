import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {WindupExecution} from "../generated/windup-services";
import {NotificationService} from "../core/notification/notification.service";
import {utils} from '../shared/utils';
import {WindupService} from "../services/windup.service";

@Injectable()
export class ExecutionResolve implements Resolve<WindupExecution|boolean> {

    public constructor(
        private _windupService: WindupService,
        private _notificationService: NotificationService,
        private _router: Router
    ) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WindupExecution|boolean> {
        let id = +route.params['executionId'];

        return new Observable<WindupExecution>(observer => {
            this._windupService.getExecution(id).subscribe(
                project => {
                    observer.next(project);
                    observer.complete();
                },
                error => {
                    this._notificationService.error(utils.getErrorMessage(error));
                    this._router.navigate(['/']);
                    observer.next(false);
                    observer.complete();
                }
            );
        });
    }
}
