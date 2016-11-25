import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import {ApplicationGroup} from "../../windup-services";
import {ApplicationGroupService} from "../../services/application-group.service";
import {NotificationService} from "../../services/notification.service";
import {Injectable} from "@angular/core";
import {utils} from '../../utils';

/**
 * Gets ApplicationGroup object for groupId route parameter.
 *
 * Uses ApplicationGroupService.get method to load ApplicationGroup object.
 * On success it returns Observable<ApplicationGroup> and navigation continues.
 * On failure, it creates new error notification using NotificationService and navigates to homepage.
 */
@Injectable()
export class ApplicationGroupResolve implements Resolve<ApplicationGroup> {

    public constructor(
        private _applicationGroupService: ApplicationGroupService,
        private _notificationService: NotificationService,
        private _router: Router
    ) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ApplicationGroup|boolean> {
        let id = +route.params['groupId'];

        return new Observable<ApplicationGroup>(observer => {
            this._applicationGroupService.get(id).subscribe(
                applicationGroup => {
                    observer.next(applicationGroup);
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
