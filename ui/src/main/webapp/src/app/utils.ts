

export module utils {

    export function getErrorMessage(error: any): string
    {
        if (error instanceof ProgressEvent) {
            return "ERROR: Server disconnected";
        } else if (typeof error == 'string') {
            return error;
        } else if (typeof error == 'object' && error.hasOwnProperty('message')) {
            return error.message;
        } else {
            return 'Unknown error: ' + error;
        }
    }

}