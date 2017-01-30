import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {MigrationProject} from "windup-services";
import {MigrationProjectService} from "./migration-project.service";
import {NotificationService} from "../core/notification/notification.service";
import {utils} from '../shared/utils';

@Injectable()
export class ProjectResolve implements Resolve<MigrationProject|boolean> {

    public constructor(
        private _migrationProjectService: MigrationProjectService,
        private _notificationService: NotificationService,
        private _router: Router
    ) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MigrationProject|boolean> {
        let id = +route.params['projectId'];

        return new Observable<MigrationProject>(observer => {
            this._migrationProjectService.get(id).subscribe(
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
