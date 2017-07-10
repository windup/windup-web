export function substringAfterLast(str, delimiter) {
    return str.substring(str.lastIndexOf(delimiter) + 1); // +1 trick for no occurence.
}

export module utils {

    export function getErrorMessage(error: any): string
    {
        if (error instanceof ProgressEvent) {
            return "The network connection was lost. Please try again later.";
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

    /**
     * Replaces "{i}" in format with i-th member of replacements.
     */
    export function formatString(format: string, ...replacements: string[]): string
    {
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof replacements[number] != 'undefined' ? replacements[number] : match;
        });
    }

    export class Arrays {
        public static flatMap<T, U>(array: T[], callbackfn: (value: T, index: number, array: T[]) => U[], thisArg?: any): U[] {
            return array.map(callbackfn, thisArg)
                .reduce((allItems, currentItems) => [...allItems, ...currentItems ], []);
        }
    }

}
