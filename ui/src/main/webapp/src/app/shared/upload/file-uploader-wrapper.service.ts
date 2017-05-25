import {
    FileItem,
    FileLikeObject,
    FileUploader,
    FileUploaderOptions,
    ParsedResponseHeaders
} from "ng2-file-upload/ng2-file-upload";
import {Observable, Subject} from "rxjs";

/**
 * This wrapper extends FileUpload class and adds Observables for events
 */
export class FileUploaderWrapper extends FileUploader {
    protected subjects: FileUploadSubjects;

    public observables: FileUploadObservables;

    public constructor(options: FileUploaderOptions) {
        super(options);

        this.subjects = {
            onBuildItemForm: new Subject<any>(),
            onBeforeUploadItem: new Subject<FileItem>(),
            onAfterAddingAll: new Subject<any[]>(),
            onAfterAddingFile: new Subject<FileItem>(),
            onWhenAddingFileFailed: new Subject<AddingFileError>(),
            onProgressItem: new Subject<{ item: FileItem, progress: number }>(),
            onProgressAll: new Subject<number>(),
            onCompleteItem: new Subject<FileUploadResponse>(),
            onCompleteAll: new Subject<void>(),
            onSuccessItem: new Subject<FileUploadResponse>(),
            onErrorItem: new Subject<FileUploadResponse>(),
            onCancelItem: new Subject<FileUploadResponse>(),
        };

        this.observables = <any>{};

        Object.keys(this.subjects).forEach((key: string) => {
            this.observables[key] = this.subjects[key].asObservable();
        });
    }

    public _onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): void {
        this.subjects.onErrorItem.next({item, response, status, headers});
        super._onErrorItem(item, response, status, headers);
    }

    public _onCompleteAll() {
        this.subjects.onCompleteAll.next();
        this.onCompleteAll();
    }

    public _onCompleteItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): void {
        this.subjects.onCompleteItem.next({item, response, status, headers});

        /**
         * Normally call to super._onCompleteItem would be here
         * But it cannot be there, because it calls onCompleteAll directly.
         * We need to call _onCompleteAll instead.
         */

        item._onComplete(response, status, headers);
        this.onCompleteItem(item, response, status, headers);
        let nextItem = this.getReadyItems()[0];

        this.isUploading = false;

        if (nextItem) {
            nextItem.upload();
            return;
        }

        this._onCompleteAll();
        this.progress = this._getTotalProgress();
        this._render();
    }

    protected _onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any): void {
        this.subjects.onWhenAddingFileFailed.next({item, filter, options});
        super._onWhenAddingFileFailed(item, filter, options);
    }

    protected _onAfterAddingFile(item: FileItem): void {
        this.subjects.onAfterAddingFile.next(item);
        super._onAfterAddingFile(item);
    }

    protected _onAfterAddingAll(items: any): void {
        this.subjects.onAfterAddingAll.next(items);
        super._onAfterAddingAll(items);
    }

    protected _onBeforeUploadItem(item: FileItem): void {
        this.subjects.onBeforeUploadItem.next(item);
        super._onBeforeUploadItem(item);
    }

    protected _onBuildItemForm(item: FileItem, form: any): void {
        this.subjects.onBuildItemForm.next({item, form});
        super._onBuildItemForm(item, form);
    }

    protected _onProgressAll(progress: number): void {
        this.subjects.onProgressAll.next(progress);
        this.onProgressAll(progress);
    }

    protected _onProgressItem(item: FileItem, progress: any): void {
        this.subjects.onProgressItem.next({item, progress});

        let total = this._getTotalProgress(progress);
        this.progress = total;
        item._onProgress(progress);

        this.onProgressItem(item, progress);
        this._onProgressAll(total);
        this._render();
    }

    protected _onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): void {
        this.subjects.onSuccessItem.next({item, response, status, headers});
        super._onSuccessItem(item, response, status, headers);
    }

    protected _onCancelItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): void {
        this.subjects.onCancelItem.next({item, response, status, headers});
        super._onCancelItem(item, response, status, headers);
    }
}

export interface FileUploadResponse {
    item: FileItem;
    response: string;
    status: number;
    headers: ParsedResponseHeaders;
}


export interface ItemProgress {
    item: FileItem;
    progress: number;
}

export interface AddingFileError {
    item: FileLikeObject;
    filter: any;
    options: any;
}

interface FileUploadSubjects {
    onBuildItemForm: Subject<any>;

    onBeforeUploadItem: Subject<FileItem>;
    onAfterAddingAll: Subject<any[]>
    onAfterAddingFile: Subject<FileItem>;
    onWhenAddingFileFailed: Subject<AddingFileError>;

    onProgressItem: Subject<{ item: FileItem, progress: number }>;
    onProgressAll: Subject<number>;

    onCompleteItem: Subject<FileUploadResponse>;
    onCompleteAll: Subject<void>;

    onSuccessItem: Subject<FileUploadResponse>;
    onErrorItem: Subject<FileUploadResponse>;
    onCancelItem: Subject<FileUploadResponse>;
}

interface FileUploadObservables {
    onBuildItemForm: Observable<any>;

    onBeforeUploadItem: Observable<FileItem>;
    onAfterAddingAll: Observable<any[]>
    onAfterAddingFile: Observable<FileItem>;
    onWhenAddingFileFailed: Observable<AddingFileError>;

    onProgressItem: Observable<{ item: FileItem, progress: number }>;
    onProgressAll: Observable<number>;

    onCompleteItem: Observable<FileUploadResponse>;
    onCompleteAll: Observable<void>;

    onSuccessItem: Observable<FileUploadResponse>;
    onErrorItem: Observable<FileUploadResponse>;
    onCancelItem: Observable<FileUploadResponse>;
}
