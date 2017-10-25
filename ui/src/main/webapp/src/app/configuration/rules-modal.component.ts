import {Component, Input, AfterViewInit, NgZone, OnDestroy} from "@angular/core";
import * as $ from "jquery";
import {RuleProviderEntity} from "../generated/windup-services";
import {SchedulerService} from "../shared/scheduler.service";

declare function prettyPrint();

@Component({
    selector: 'wu-rules-modal',
    templateUrl: 'rules-modal.component.html'
})
export class RulesModalComponent implements OnDestroy {
    @Input()
    ruleProviderEntity: RuleProviderEntity = <RuleProviderEntity>{};

    prettyPrintTimeout: any;

    public constructor(private _schedulerService: SchedulerService, private _zone: NgZone) {
    }

    ngOnDestroy(): void {
        if (this.prettyPrintTimeout) {
            this._schedulerService.clearTimeout(this.prettyPrintTimeout);
            this.prettyPrintTimeout = null;
        }
    }

    show(): void {
        (<any>$('#rulesModal')).modal();
        this.prettyPrintTimeout = this._schedulerService.setTimeout(() => prettyPrint(), 1000);
    }
}
