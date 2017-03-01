import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import {NotificationService} from "../../../core/notification/notification.service";
import {ReportFilterService} from "./report-filter.service";
import {utils} from "../../../utils";
import {Injectable} from "@angular/core";

@Injectable()
export class ReportFilterResolve implements Resolve<any> {

    public constructor(
        private _reportFilterService: ReportFilterService,
        private _notificationService: NotificationService,
        private _router: Router
    ) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return new Observable<any>(observer => {
            this._reportFilterService.getFilter(route.parent.parent.data['applicationGroup']).subscribe(
                filter => {
                    observer.next(filter);
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
