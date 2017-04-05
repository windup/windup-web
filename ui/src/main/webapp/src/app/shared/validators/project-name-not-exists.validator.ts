import {AbstractControl, AsyncValidatorFn} from "@angular/forms";
import {FileService} from "../../services/file.service";
import {MigrationProjectService} from "../../project/migration-project.service";
import { Directive } from '@angular/core';

/**
 * Fails validation if the name in the given control already exists as a project name.
 */
@Directive({
    selector: '[projectNameNotUsed]'
})
export class ProjectNameNotExistsValidator {

    static create(projectService: MigrationProjectService): AsyncValidatorFn {
        return function (control: AbstractControl): {[key: string]: any} {
            return new Promise(resolve => {
                projectService.getIdByName(control.value).subscribe(result => {
                    if (result === null)
                        resolve(null);
                    else
                        resolve({isNameFree: false});
                });
            });
        };
    };

}
