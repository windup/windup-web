import {Directive, forwardRef, Input} from "@angular/core";
import {FormControl, NG_ASYNC_VALIDATORS, Validator} from "@angular/forms";
import {MigrationProjectService} from "../../project/migration-project.service";
import {MigrationProject} from "windup-services";

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
    project: MigrationProject;

    constructor(private projectService: MigrationProjectService)
    {
    }

    validate(control: FormControl): Promise<{[key: string] : boolean}> {
        let projectService = this.projectService;

        return new Promise(resolve => {
            projectService.getIdByName(control.value.trim()).subscribe(result => {
                if (result == null) {
                    resolve(null);
                } else {
                    // When updating, it's ok to enter the same name.
                    if (this.project != null && result == this.project.id)
                        resolve(null);
                    else
                        resolve({['nameIsTaken']: true});
                }
            });
        });
    }

}
