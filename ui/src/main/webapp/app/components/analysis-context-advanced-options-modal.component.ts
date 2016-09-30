import {Component, Input, Output, ViewChild} from "@angular/core";
import {ConfigurationOption} from "../model/configuration-option.model";
import {AdvancedOption} from "windup-services";
import {ModalDialogComponent} from "./modal-dialog.component";

@Component({
    selector: 'analysis-context-advanced-options',
    template: `
    <modal-dialog>
        <div header>
            Advanced Options
        </div>
        <div body>
            <form class="form-horizontal">
                
                <table class="datatable table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Option</th>
                            <th>Value</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let selectedOption of selectedOptions; let i = index;">
                            <td>
                                {{selectedOption.name}}
                            </td>
                            <td>
                                {{selectedOption.value}}
                            </td>
                            <td>
                                <button (click)="removeAdvancedOption(i)" class="btn-warning" href="#">Delete</button>
                            </td>
                        </tr>
                        <tr *ngIf="newOption">
                            <td>
                                <select class="form-control" name="newOptionTypeSelection" [(ngModel)]="newOption.name">
                                    <option *ngFor="let option of availableOptions" value="{{option.name}}">{{option.name}}</option>
                                </select>
                            </td>
                            <td>
                                <div [ngSwitch]="currentOptionType">
                                    <input *ngSwitchCase="'text'" type="text" name="currentOptionInput" class="form-control" [(ngModel)]="newOption.value">
                                    <input *ngSwitchCase="'checkbox'" type="checkbox" class="form-control" name="currentOptionInput" [(ngModel)]="newOption.value">
                                    <select *ngSwitchCase="'select'" class="form-control">
                                        <option *ngFor="let option of currentSelectedOptionDefinition.availableValues" value="{{option}}">{{option}}</option>
                                    </select>
                                </div>
                            </td>
                            <td>
                                <button (click)="addAdvancedOption()">Add</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button *ngIf="!newOption" (click)="startAddNew()">Add New Option</button>
                
            </form>
        </div>
        <div footer>
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
        </div>
    </modal-dialog>
`
})
export class AnalysisContextAdvancedOptionsModalComponent {
    @Input()
    configurationOptions:ConfigurationOption[] = [];

    @Input() @Output()
    selectedOptions:AdvancedOption[];

    @ViewChild(ModalDialogComponent)
    private modalDialog:ModalDialogComponent;

    private newOption:AdvancedOption;

    private get currentSelectedOptionDefinition():ConfigurationOption {
        return this.configurationOptions.find((option:ConfigurationOption) => {
            return this.newOption.name == option.name;
        });
    }

    private get currentOptionType():string {
        if (this.newOption.name == null)
            return null;

        let configurationOption = this.currentSelectedOptionDefinition;

        switch (configurationOption.type) {
            case "java.io.File":
            case "java.lang.String":
                return configurationOption.uitype == "SELECT_MANY" ? "select" : "text";
            case "java.lang.Boolean":
                return "checkbox";
            default:
                return null;
        }
    }

    constructor() {
        this.resetCurrentOption();
    }

    private resetCurrentOption() {
        this.newOption = null;
    }

    get availableOptions():ConfigurationOption[] {
        if (this.configurationOptions == null)
            return [];

        return this.configurationOptions.filter((option:ConfigurationOption) => {
            if (this.selectedOptions == null)
                return true;

            if (option.uitype == "MANY" || option.uitype == "SELECT_MANY")
                return true;

            return this.selectedOptions.find((selectedOption:AdvancedOption) => {
                        return selectedOption.name == option.name;
                   }) == null;
        });
    }

    private removeAdvancedOption(index:number) {
        this.selectedOptions.splice(index, 1);
        return false;
    }

    private startAddNew() {
        this.newOption = <AdvancedOption>{};
        this.newOption.value = "";
    }

    private addAdvancedOption() {
        if (this.selectedOptions == null)
            this.selectedOptions = [];

        if (this.currentOptionType == "checkbox" && !this.newOption.value)
            this.newOption.value = "false";

        this.selectedOptions.push(this.newOption);

        this.resetCurrentOption();
    }

    show() {
        this.modalDialog.show();
    }
}