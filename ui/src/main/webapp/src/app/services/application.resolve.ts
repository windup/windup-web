import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {MigrationProject} from "windup-services";
import {NotificationService} from "../core/notification/notification.service";
import {RegisteredApplicationService} from "./registered-application.service";
import {RegisteredApplication} from "windup-services";
import {utils} from '../utils';

@Injectable()
export class ApplicationResolve implements Resolve<RegisteredApplication|boolean> {

    public constructor(
        private _registeredApplicationService: RegisteredApplicationService,
        private _notificationService: NotificationService,
        private _router: Router
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RegisteredApplication|boolean> {
        let id = +route.params['applicationId'];

        return new Observable<RegisteredApplication>(observer => {
            this._registeredApplicationService.get(id).subscribe(
                application => {
                    observer.next(application);
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
