import {Component, Input, OnInit, Output} from '@angular/core';

import { RulesPath } from 'windup-services';

import {ConfigurationService} from "../services/configuration.service";
import {Configuration} from "windup-services";


@Component({
    selector: 'custom-rule-selection',
    templateUrl: 'app/components/custom-rule-selection.component.html'
})
export class CustomRuleSelectionComponent implements OnInit {
    @Input()
    configuration:Configuration;

    rulesPaths:RulesPath[] = RULE_PATHS;
    
    constructor(private _configurationService: ConfigurationService)    {

    }

    private _selectedRulePaths:RulesPath[];

    @Input() @Output()
    set selectedRulePaths(selectedRulesPaths:RulesPath[]) {
        this._selectedRulePaths = selectedRulesPaths;
        this._selectedIDs = this._selectedRulePaths.map((rulesPath:RulesPath) => rulesPath.id);
    };

    get selectedRulePaths():RulesPath[] {
        return this._selectedRulePaths;
    }

    private _selectedIDs:number[];

    get selectedRulePathIDs():number[] {
        return this._selectedIDs;
    }

    set selectedRulePathIDs(ruleIDs:number[]) {
        this._selectedIDs = ruleIDs;
        this._selectedRulePaths = this.rulesPaths.filter((rulesPath:RulesPath) => ruleIDs.indexOf(rulesPath.id) != -1);
    }

    customRegisteredRulesets: RulesPath[] = RULE_PATHS;


    ngOnInit() {
        this._selectedRulePaths = RULE_PATHS.slice();
    }

    change(options) {
        if (options.length == 0)
            return;
        console.log("Selected values" + options);
        this._selectedRulePaths = Array.apply(null, options)
            .filter(option => option.selected)
            .map(option => option.value);
    }
}

/*
 * just for quick prototypign
 */
const RULE_PATHS: RulesPath[] = [
    { id: 1, version: 1, path: "test1.windup.xml", loadError: "", rulesPathType: "USER_PROVIDED" },
    { id: 2, version: 1, path: "test2.windup.xml", loadError: "", rulesPathType: "USER_PROVIDED" },
    { id: 3, version: 1, path: "test3.windup.xml", loadError: "", rulesPathType: "USER_PROVIDED" },
]; 