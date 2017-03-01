import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {WindupService} from "../services/windup.service";
import {WindupExecution} from "windup-services";
import {WINDUP_WEB} from "../app.module";

import {someLog} from './some-log';

@Component({
    templateUrl: './execution-detail.component.html',
    styleUrls: ['./execution-detail.component.scss']
})
export class ExecutionDetailComponent implements OnInit {

    execution: WindupExecution;

    log: string;

    hideUnfinishedFeatures: boolean = WINDUP_WEB.config.hideUnfinishedFeatures;

    constructor(private _activatedRoute: ActivatedRoute, private _windupService: WindupService) {
        this.log = someLog;
    }

    ngOnInit(): void {
        this._activatedRoute.parent.params.subscribe((params: {executionId: number}) => {
            let executionId = +params.executionId;

            this._windupService.getStatusGroup(executionId).subscribe(execution => {
                this.execution = execution;
            });
        });
    }
}
