import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import 'rxjs/add/observable/of';
import {Injectable} from "@angular/core";
import {NotificationService} from "../../core/notification/notification.service";
import {utils} from '../../shared/utils';
import {SourceFileModel} from "../../generated/tsModels/SourceFileModel";
import {FileModelService} from "../../services/graph/file-model.service";
import {FileModel} from "../../generated/tsModels/FileModel";
import {RouteFlattenerService} from "../../core/routing/route-flattener.service";

@Injectable()
export class SourceResolve implements Resolve<SourceFileModel|boolean> {

    public constructor(
        private _fileModelService: FileModelService,
        private _notificationService: NotificationService,
        private _routeFlattener: RouteFlattenerService,
        private _router: Router
    ) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SourceFileModel|boolean>
    {
        let routeData = this._routeFlattener.getFlattenedRouteData(route);
        let execId = +routeData.params['executionId'];
        let fileId = +routeData.params['fileId'];
        if (!execId || !fileId)
            return Observable.of(false);

        return new Observable<SourceFileModel|boolean>(observer => {
            this._fileModelService.getFileModel(execId, fileId).subscribe(
                (file: FileModel) => {
                    observer.next(file as any as SourceFileModel); // TODO: Check correct type for this
                    observer.complete();
                },
                error => {
                    this._notificationService.error("Could not load file information: " + utils.getErrorMessage(error));
                    //this._router.navigate(['/']);
                    observer.next(false);
                    observer.complete();
                }
            );
        });
    }
}
