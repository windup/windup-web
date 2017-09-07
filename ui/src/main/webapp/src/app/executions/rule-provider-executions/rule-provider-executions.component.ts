import {Component, OnInit, AfterViewChecked, ElementRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {RuleProviderExecutionsService} from "./rule-provider-executions.service";
import {ExecutionPhaseModel} from "../../generated/tsModels/ExecutionPhaseModel";
import {AbstractComponent} from "../../shared/AbstractComponent";

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
export class RuleProviderExecutionsComponent extends AbstractComponent implements OnInit, AfterViewChecked {
    phases: ExecutionPhaseModel[];
    protected anchor: string;

    constructor(
        private _ruleProviderExecutionsService: RuleProviderExecutionsService,
        private _activatedRoute: ActivatedRoute,
        private _element: ElementRef
    ) {
        super();
    }

    ngOnInit(): void {
        this._activatedRoute.parent.params.takeUntil(this.destroy).subscribe((params: {executionId: number}) => {
            this._ruleProviderExecutionsService.getPhases(params.executionId).takeUntil(this.destroy)
                .subscribe(phases => {
                    this.phases = phases;
                });
        });

        this._activatedRoute.queryParams.takeUntil(this.destroy).subscribe((queryParams) => {
            if (queryParams.hasOwnProperty('ruleID')) {
                this.anchor = queryParams['ruleID'];
            }
        });
    }


    ngAfterViewChecked(): void {
        if (this.anchor) {
            let element = this._element.nativeElement.querySelector(`a[name="${this.anchor}"]`);

            if (element) {
                element.scrollIntoView(element);
                this.anchor = null;
            }
        }
    }
}
