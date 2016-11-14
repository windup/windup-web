import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import {ApplicationGroup} from "../windup-services";
import {ApplicationGroupService} from "./applicationgroup.service";
import {NotificationService} from "../notification/notification.service";
import {Injectable} from "@angular/core";

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
                    console.log('ApplicationGroupResolve: Error');
                    this._notificationService.error(error);
                    this._router.navigate(['/']);
                    observer.next(false);
                }
            );
        });
    }
}
