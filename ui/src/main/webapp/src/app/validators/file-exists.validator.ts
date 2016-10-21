import {AbstractControl} from "@angular/forms";
import {FileService} from "../services/file.service";

export class FileExistsValidator {

    static create(fileService: FileService) {
        return function (c: AbstractControl): {[key: string]: any} {
            return new Promise(resolve => {
                fileService.pathExists(c.value).subscribe(result => {
                    if (result)
                        resolve(null);
                    else
                        resolve({fileExists: false});
                });
            });
        };
    };
}
