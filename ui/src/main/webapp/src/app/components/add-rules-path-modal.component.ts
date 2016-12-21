import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {FormComponent} from "./form.component";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {FileExistsValidator} from "../validators/file-exists.validator";
import {FileService} from "../services/file.service";
import {ConfigurationService} from "../services/configuration.service";
import {Configuration, RulesPath} from "windup-services";

@Component({
    selector: 'add-rules-path-modal',
    templateUrl: 'add-rules-path-modal.component.html'
})
export class AddRulesPathModalComponent extends FormComponent implements OnInit {
    @Input()
    configuration:Configuration;

    @Output()
    configurationSaved = new EventEmitter();

    inputPath = "";

    addRulesPathForm: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        private _fileService: FileService,
        private _configurationService: ConfigurationService
    ) {
        super();
    }

    ngOnInit():void {
        this.addRulesPathForm = this._formBuilder.group({
            inputPathControl: ["", Validators.compose([Validators.required, Validators.minLength(4)]), FileExistsValidator.create(this._fileService)]
        });
    }

    show():void {
        this.errorMessages = [];
        if (this.addRulesPathForm)
            this.addRulesPathForm.reset();

        (<any>$('#addRulesPathModal')).modal('show');
    }

    hide():void {
        (<any>$('#addRulesPathModal')).modal('hide');
    }

    addPath():void {
        let newConfiguration = JSON.parse(JSON.stringify(this.configuration));

        let newPath = <RulesPath>{};
        newPath.path = this.inputPath;
        newPath.rulesPathType = "USER_PROVIDED";

        newConfiguration.rulesPaths.push(newPath);

        this._configurationService.save(newConfiguration).subscribe(
            configuration => {
                this.configuration = configuration;
                this.configurationSaved.emit({
                    configuration: this.configuration
                });
                this.hide();
            },
            error => this.handleError(<any>error)
        );
    }
}

export interface ConfigurationEvent extends Event {
    configuration:Configuration;
}
