import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

import { RulesPath } from 'windup-services';

import {ConfigurationService} from "../services/configuration.service";
import {Configuration} from "windup-services";


@Component({
    selector: 'custom-rule-selection',
    templateUrl: 'app/components/custom-rule-selection.component.html'
})
export class CustomRuleSelectionComponent implements OnInit {
    @Input() selectedRulePaths: RulesPath[];
    @Output() selectedRulePathsChange = new EventEmitter<RulesPath[]>();

    rulesPaths: RulesPath[] = [];

    constructor(private _configurationService: ConfigurationService) {

    }


    ngOnInit() {
        this._configurationService.getCustomRulesetPaths().subscribe(
            rulesets => this.rulesPaths = rulesets,
            err => { console.log(err) }
        );
    }

    updateSelection() {
        this.selectedRulePathsChange.emit(this.selectedRulePaths);
    }

    clearSelection() {
        this.selectedRulePaths = [];
    }

    selectAll() {
        this.selectedRulePaths = this.rulesPaths.slice();
    }
}
