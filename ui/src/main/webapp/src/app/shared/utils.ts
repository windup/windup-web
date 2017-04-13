import {ExecutionState} from "windup-services";

export function substringAfterLast(str, delimiter) {
    return str.substring(str.lastIndexOf(delimiter) + 1); // +1 trick for no occurence.
}

export module utils {

    export function getErrorMessage(error: any): string
    {
        if (error instanceof ProgressEvent) {
            return "ERROR: Server disconnected";
        } else if (typeof error == 'string') {
            return error;
        } else if (typeof error == 'object' && error.hasOwnProperty('message')) {
            return error.message;
        } else if (typeof error == 'object' && error.hasOwnProperty('error')) {
            return error.error;
        } else {
            return 'Unknown error: ' + error;
        }
    }

    export function humanReadableLabel(state: ExecutionState): string {
        switch (state) {
            case "STARTED":
                return 'In Progress';
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
