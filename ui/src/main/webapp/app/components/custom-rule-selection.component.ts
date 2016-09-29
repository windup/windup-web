import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

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

    @Input() selectedRulePaths: RulesPath[];
    @Output() selectedRulePathsChange = new EventEmitter<RulesPath[]>();

    customRegisteredRulesets: RulesPath[] = RULE_PATHS;

    rulesPaths:RulesPath[] = RULE_PATHS;
    
    constructor(private _configurationService: ConfigurationService)    {

    }

    ngOnInit() {
        this.selectedRulePaths = RULE_PATHS.slice();
    }

    updateSelection() {
        this.selectedRulePathsChange.emit(this.selectedRulePaths);
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
