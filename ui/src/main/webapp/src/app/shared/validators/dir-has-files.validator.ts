import {AbstractControl, AsyncValidatorFn, ValidationErrors} from "@angular/forms";
import {FileService} from "../../services/file.service";

export class IfDirectoryThenShouldNonEmptyHaveFilesValidator {

    static create(fileService: FileService): AsyncValidatorFn {
        return function (control: AbstractControl): Promise<ValidationErrors|null> {
            return new Promise(resolve => {
                /// TODO: Parametrize
                fileService.queryServerPathDirectoryFilesContained(control.value, "^.*\\.[ewjsh]ar", 50).subscribe(result => {
                    if (result != 0)
                        resolve(null);
                    else
                        resolve({directoryContainsFiles: false});
                });
            });
        };
    };

}
