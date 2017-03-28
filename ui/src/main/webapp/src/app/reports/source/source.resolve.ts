import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {MigrationProject} from "windup-services";
import {NotificationService} from "../../core/notification/notification.service";
import {utils} from '../../shared/utils';
import {SourceFileModel} from "../../generated/tsModels/SourceFileModel";
import {FileModelService} from "../../services/graph/file-model.service";
import {FileModel} from "../../generated/tsModels/FileModel";

@Injectable()
export class SourceResolve implements Resolve<SourceFileModel|boolean> {

    public constructor(
        private _fileModelService: FileModelService,
        private _notificationService: NotificationService,
        private _router: Router
    ) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SourceFileModel|boolean> {
        let execId = +route.params['executionId'];
        let fileId = +route.params['fileId'];

        if (!execId || !fileId)
            return Observable.of(false);

        return new Observable<SourceFileModel>(observer => {
            this._fileModelService.getFileModel(execId, fileId).subscribe(
                (file: FileModel) => {
                    observer.next(file);
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
