import {Directive, forwardRef, Input} from '@angular/core';
import {FormControl, NG_ASYNC_VALIDATORS, Validator} from "@angular/forms";
import {MigrationProjectService} from "../../project/migration-project.service";

/**
 * Fails validation if the name in the given control already exists as a project name.
 */
@Directive({
    selector: '[wuProjectNameNotUsed]',
    providers: [
        { provide: NG_ASYNC_VALIDATORS, useExisting: forwardRef(() => ProjectNameNotExistsValidator), multi: true }
    ]
})
export class ProjectNameNotExistsValidator implements Validator {

    @Input()
    editMode:boolean;

    constructor(private projectService: MigrationProjectService)
    {
    }

    validate(control: FormControl):Promise<{[key: string] : boolean}> {
        let projectService = this.projectService;

        return new Promise(resolve => {
            if (this.editMode) {
                resolve(null);
                return;
            }
            projectService.getIdByName(control.value).subscribe(result => {
                if (result == null) {
                    resolve(null);
                } else {
                    resolve({['nameIsTaken']: true});
                }
            });
        });
    }

}
