import {Component, Input, OnChanges, SimpleChanges, SimpleChange} from "@angular/core";
import {ApplicationGroup, ReportFilter} from "windup-services";

@Component({
    selector: 'wu-report-filter-indicator',
    templateUrl: './report-filter-indicator.component.html',
    styleUrls: ['./report-filter-indicator.component.css']
})
export class ReportFilterIndicatorComponent implements OnChanges {
    @Input()
    group: ApplicationGroup|any;
    // TODO: This is workaround, without |any it would not find 'windup-services' module;

    filter: ReportFilter;

    constructor() {

    }


    ngOnChanges(changes: {group: SimpleChange}): void {
        if (changes.group && changes.group.currentValue) {
            this.filter = changes.group.currentValue.reportFilter;
        }
    }
}
