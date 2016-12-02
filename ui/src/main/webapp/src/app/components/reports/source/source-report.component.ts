import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";

@Component({
    templateUrl: '/source-report.component.html'
})
export class SourceReportComponent implements OnInit {
    private execID: number;
    private fileID: number;


    constructor(private route: ActivatedRoute, private _router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.execID = +params['executionId'];
            this.fileID = +params['fileId'];
        });
    }
}