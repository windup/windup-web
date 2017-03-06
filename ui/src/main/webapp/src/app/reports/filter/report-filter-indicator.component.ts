import {Component, Input} from "@angular/core";
import {ReportFilter} from "windup-services";
import {WindupExecution} from "windup-services";

@Component({
    selector: 'wu-report-filter-indicator',
    templateUrl: './report-filter-indicator.component.html',
    styleUrls: ['./report-filter-indicator.component.css']
})
export class ReportFilterIndicatorComponent {
    private _execution: WindupExecution;

    filter: ReportFilter;

    @Input()
    public set execution(execution: WindupExecution|any) {
        if (execution) {
            this._execution = execution;
            this.filter = execution.reportFilter;
        }
    }
}
