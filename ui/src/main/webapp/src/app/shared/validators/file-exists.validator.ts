import {AbstractControl, AsyncValidatorFn} from "@angular/forms";
import {FileService} from "../../services/file.service";

export class FileExistsValidator {

    static create(fileService: FileService): AsyncValidatorFn {
        return function (control: AbstractControl): {[key: string]: any} {
            return new Promise(resolve => {
                fileService.pathExists(control.value).subscribe(result => {
                    if (result)
                        resolve(null);
                    else
                        resolve({fileExists: false});
                });
            });
        };
    };

    static createPathTargetTypeValidator(fileService: FileService): AsyncValidatorFn {
        return function (control: AbstractControl): {[key: string]: any} {
            return new Promise(resolve => {
                fileService.queryServerPathTargetType(control.value).subscribe( (pathTargetType: string) => {
                    if (pathTargetType === "FILE" || pathTargetType === "DIRECTORY")
                        resolve(null);
                    else
                        resolve({pathTargetType: pathTargetType});
                });
            });
        };
    };
}
