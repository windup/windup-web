import {Component, Input, OnChanges, SimpleChanges, SimpleChange} from "@angular/core";
import {ApplicationGroup} from "../../../windup-services";
import {ReportFilter} from "windup-services";

@Component({
    selector: 'wu-report-filter-indicator',
    templateUrl: './report-filter-indicator.component.html',
    styleUrls: ['./report-filter-indicator.component.css']
})
export class ReportFilterIndicatorComponent implements OnChanges {
    @Input()
    group: ApplicationGroup;
    filter: ReportFilter;

    constructor() {

    }


    ngOnChanges(changes: {group: SimpleChange}): void {
        if (changes.group && changes.group.currentValue) {
            this.filter = changes.group.currentValue.reportFilter;
        }
    }
}
