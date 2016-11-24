import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {MigrationProject} from "windup-services";
import {NotificationService} from "./notification.service";
import {Configuration} from "../windup-services";
import {ConfigurationService} from "./configuration.service";
import {utils} from '../utils';

@Injectable()
export class ConfigurationResolve implements Resolve<Configuration> {

    public constructor(
        private  _configurationService: ConfigurationService,
        private _notificationService: NotificationService,
        private _router: Router
    ) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MigrationProject|boolean> {
        return new Observable<MigrationProject>(observer => {
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
