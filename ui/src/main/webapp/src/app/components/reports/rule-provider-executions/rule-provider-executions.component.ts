import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {RuleProviderExecutionsService} from "./rule-provider-executions.service";
import {ExecutionPhaseModel} from "../../../generated/tsModels/ExecutionPhaseModel";

@Component({
    templateUrl: './rule-provider-executions.component.html',
    styles: [
        `:host /deep/ .alert-info {
            background-color: #5bc0de;
            color: #ffffff;
            font-size: 12px;
            font-weight: 300;
            padding: 15px;
            margin-bottom: 21px;
            border: 1px solid #3db5d8;
            border-radius: 0;
        }`
    ]
})
export class RuleProviderExecutionsComponent implements OnInit {
    protected phases: ExecutionPhaseModel[];

    constructor(
        private _ruleProviderExecutionsService: RuleProviderExecutionsService,
        private _activatedRoute: ActivatedRoute
    ) {

    }

    ngOnInit(): void {
        this._activatedRoute.parent.params.subscribe((params: {executionId: number}) => {
            this._ruleProviderExecutionsService.getPhases(params.executionId)
                .subscribe(phases => {
                    this.phases = phases;
                    console.log(phases);
                });
        });
    }
}
