import {Pipe, PipeTransform} from "@angular/core";
import {ExecutionState} from "windup-services";

@Pipe({
    name: 'wuPrettyExecutionStatus'
})

export class PrettyExecutionStatus implements PipeTransform {

    transform(state: ExecutionState): string {
        switch (state) {
            case "STARTED":
                return 'In progress';
            case "QUEUED":
                return 'Queued';
            case "COMPLETED":
                return 'Completed';
            case "FAILED":
                return 'Failed';
            case "CANCELLED":
                return 'Cancelled';
            default:
                return state;
        }
    }
}
