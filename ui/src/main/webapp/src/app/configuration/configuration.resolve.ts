import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {NotificationService} from "../core/notification/notification.service";
import {Configuration} from "../generated/windup-services";
import {ConfigurationService} from "./configuration.service";
import {utils} from '../shared/utils';

@Injectable()
export class ConfigurationResolve implements Resolve<Configuration|boolean> {

    public constructor(
        private  _configurationService: ConfigurationService,
        private _notificationService: NotificationService,
        private _router: Router
    ) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Configuration|boolean> {
        return new Observable<Configuration>(observer => {
            this._configurationService.get().subscribe(
                configuration => {
                    observer.next(configuration);
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
