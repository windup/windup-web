import {Component, Input, OnInit} from '@angular/core';

import { RuleProviderEntity, RulesPath } from 'windup-services';

import {ConfigurationService} from "../services/configuration.service";
import {Configuration} from "windup-services";


@Component({
    selector: 'custom-rule-selection',
    templateUrl: 'app/components/custom-rule-selection.component.html'
})
export class CustomRuleSelectionComponent implements OnInit {
    @Input()
    configuration:Configuration;
    
    constructor(private _configurationService: ConfigurationService)    {

    }

    selectedRulesets: RulesPath[] = <RulesPath>{};
    customRegisteredRulesets: RulesPath[] = RULE_PATHS;


    ngOnInit() {
                  this.selectedRulesets = RULE_PATHS.slice(); 
    }

    change(options) {
        if (options.length == 0)
            return;
        console.log("Selected values" + options);
        this.selectedRulesets = Array.apply(null, options)
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