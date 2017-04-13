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

}
