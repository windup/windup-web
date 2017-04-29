import {Injectable} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";

/**
 * Service for storing all routes visited in application
 *
 * It can be used to navigate back
 */
@Injectable()
export class RouteHistoryService {
    navigationEvents: NavigationEnd[] = [];

    public constructor(private _router: Router) {

    }

    /**
     * Adds navigation event into stack
     * @param event
     */
    public addNavigationEvent(event: NavigationEnd) {
        this.navigationEvents.push(event);
    }

    /**
     * Gets number of previous routes available
     */
    public get countPreviousRoutes(): number {
        return this.navigationEvents.length - 1;
    }

    /**
     * Returns previous route which was triggered before
     *
     * @param steps
     * @returns {string}
     */
    public getPreviousRoute(steps: number = 1): string {
        if (steps < 0) {
            throw new Error('Parameter steps must be greater or equal to 0');
        }

        if (steps > this.countPreviousRoutes) {
            throw new Error(`Cannot go back more than ${this.countPreviousRoutes} steps, attempted to do ${steps} steps`);
        }

        let index = this.countPreviousRoutes - steps;

        return this.navigationEvents[index].urlAfterRedirects;
    }

    /**
     * Returns previous route, if there is any. If not, returs defaultUrl
     *
     * @param steps {number}
     * @param defaultUrl {string}
     * @returns {string}
     */
    public getPreviousRouteOrDefaultUrl(steps: number = 1, defaultUrl: string) {
        if (steps > this.countPreviousRoutes) {
            return defaultUrl;
        }

        return this.getPreviousRoute(steps);
    }

    /**
     * Navigates to previous route if exists or to route specified in parameter
     *
     * @param route
     * @returns {Promise<boolean>}
     */
    public navigateBackOrToRoute(route: string): Promise<boolean> {
        let navigationRoute = [];

        if (this.countPreviousRoutes > 0) {
            navigationRoute.push(this.getPreviousRoute(1));
        }
        else {
            navigationRoute.push(route);
        }

        return this._router.navigate(navigationRoute);
    }
}
