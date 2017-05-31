import {Component, Input} from "@angular/core";
import {WindupExecution} from "../generated/windup-services";

@Component({
    selector: 'wu-active-executions-progressbar',
    templateUrl: './active-executions-progressbar.component.html'
})
export class ActiveExecutionsProgressbarComponent {
    @Input()
    activeExecutions: WindupExecution[];

    get mainExecution() {
        let mainExecution = null;
        if (!this.activeExecutions)
            return null;

        return this.activeExecutions.find(execution => execution.currentTask != null && execution.currentTask != "");
    }
}
