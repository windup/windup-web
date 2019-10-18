import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {NotificationService} from "../core/notification/notification.service";
import {Configuration} from "../generated/windup-services";
import {ConfigurationService} from "./configuration.service";
import {utils} from '../shared/utils';
import { RoutedComponent } from "../shared/routed.component";
import { RouteFlattenerService } from "../core/routing/route-flattener.service";

@Injectable()
export class ProjectConfigurationResolve extends RoutedComponent implements Resolve<Configuration|boolean> {

    public constructor(
         _router: Router,
        _activatedRoute: ActivatedRoute,
        _routeFlattener: RouteFlattenerService,
        private  _configurationService: ConfigurationService,
        private _notificationService: NotificationService
    ) {
        super(_router, _activatedRoute, _routeFlattener);
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Configuration|boolean> {
        const flatRouteData = this._routeFlattener.getFlattenedRouteData(route);        
        const projectId = flatRouteData.data['project'].id;

        return new Observable<Configuration|boolean>(observer => {
            this._configurationService.getByProjectId(projectId).subscribe(
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
