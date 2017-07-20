import {Injectable} from "@angular/core";

@Injectable()
export class UrlCleanerService {
    static SKIP_PARAMS = [ 'redirect_fragment', 'state', 'code' ];

    /**
     * Filter selected query params
     *
     * @param url {string}
     * @param filteredParams {string[]}
     * @returns {string}
     */
    filterQueryParams(url: string, filteredParams: string[]): string {
        const fragmentSeparatorIndex = url.indexOf('#');

        let fragments = '';

        if (fragmentSeparatorIndex !== -1) {
            fragments = url.substr(fragmentSeparatorIndex);
        }

        return this.filterParams(url, filteredParams, '?') + fragments;
    }


    /**
     * Filter selected fragments
     *
     * @param url {string}
     * @param filteredFragments {string[]}
     * @returns {string}
     */
    filterFragments(url: string, filteredFragments: string[]): string {
        return this.filterParams(url, filteredFragments, '#');
    }

    protected filterParams(url: string, filteredParams: string[], separator: string = '?'): string {
        if (url.indexOf(separator) === -1 || filteredParams.length === 0) {
            return url;
        }

        let [uri, params] = url.split(separator);

        const cleanedParams = params.split('&').filter(param => {
            const [paramName, ] = param.split('=');

            return filteredParams.indexOf(paramName) === -1 && paramName !== '';
        });

        if (cleanedParams.length > 0) {
            uri = uri + separator + cleanedParams.join('&');
        }

        return uri;
    }
}
