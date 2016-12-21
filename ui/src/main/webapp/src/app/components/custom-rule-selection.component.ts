import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

import {RulesPath} from 'windup-services';

import {ConfigurationService} from "../services/configuration.service";


@Component({
    selector: 'custom-rule-selection',
    templateUrl: 'custom-rule-selection.component.html'
})
export class CustomRuleSelectionComponent implements OnInit {
    private _selectedRulePaths: RulesPath[];

    @Output()
    selectedRulePathsChanged:EventEmitter<RulesPath[]> = new EventEmitter<RulesPath[]>();

    @Input()
    public get selectedRulePaths():RulesPath[] {
        return this._selectedRulePaths;
    }

    public set selectedRulePaths(paths:RulesPath[]) {
        this._selectedRulePaths = paths;
        if (this.selectedRulePaths != null)
            this._selectedRuleIDs = this.selectedRulePaths.map(rulesPath => rulesPath.id);
        else
            this._selectedRuleIDs = [];

        this.selectedRulePathsChanged.emit(this._selectedRulePaths);
    }

    private _selectedRuleIDs;
    private get selectedRuleIDs():number[] {
        return this._selectedRuleIDs;
    }

    private set selectedRuleIDs(ids:number[]) {
        this.selectedRulePaths = this.rulesPaths.filter((value) => {
            return ids.indexOf(value.id) != -1;
        });
    }

    rulesPaths: RulesPath[] = [];

    constructor(private _configurationService: ConfigurationService) { }

    ngOnInit() {
        this._configurationService.getCustomRulesetPaths().subscribe(
            rulesPaths => {
                this.rulesPaths = rulesPaths;
            },
            err => { console.log(err) }
        );
    }

    clearSelection() {
        this.selectedRulePaths = [];
        return false;
    }

    selectAll() {
        this.selectedRulePaths = this.rulesPaths;
        return false;
    }
}
