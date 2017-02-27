import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {WindupService} from "../../services/windup.service";
import {WindupExecution} from "windup-services";

import {someLog} from './some-log';

@Component({
    templateUrl: 'execution-detail.component.html',
    styleUrls: ['./execution-detail.component.scss']
})
export class ExecutionDetailComponent implements OnInit {

    execution: WindupExecution;

    log: string;

    constructor(private _activatedRoute: ActivatedRoute, private _windupService: WindupService) {
        this.log = someLog;
    }

    ngOnInit(): void {
        this._activatedRoute.parent.params.subscribe((params: {executionId: number}) => {
            let executionId = +params.executionId;

            this._windupService.getExecution(executionId).subscribe(execution => {
                this.execution = execution;
            });
        });
    }
}
