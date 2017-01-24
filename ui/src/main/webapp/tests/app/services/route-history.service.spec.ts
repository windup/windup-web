import {RouteHistoryService} from "../../../src/app/services/route-history.service";
import {Router} from "@angular/router";

describe("RouteHistoryService", () => {
    let router: Router;
    let instance: RouteHistoryService;

    beforeEach(() => {
        router = jasmine.createSpyObj('Router', ['navigate']);
        instance = new RouteHistoryService(router);
    });

    let navigateToPreviousRoute = () => {
        it('should navigate to parameter route', () => {
            let dummyRoute = 'some/dummy/route';

            instance.navigateBackOrToRoute(dummyRoute);
            expect(router.navigate).toHaveBeenCalledWith([dummyRoute]);
        });
    };

    describe('with empty routing history (this should never happen)', () => {
        navigateToPreviousRoute();

        it('should have -1 previous routes', () => {
            expect(instance.countPreviousRoutes).toBe(-1);
        });

        it('should throw exception when attempting to get current route', () => {
            expect(() => instance.getPreviousRoute(0)).toThrow();
        });

        it('should throw exception when attempting to get negative number of steps back', () => {
            let errorMessage = 'Parameter steps must be greater or equal to 0';
            expect(() => instance.getPreviousRoute(-1)).toThrowError(errorMessage);
        });
    });

    describe('with only current page in routing history', () => {
        let currentUrl = 'some/currently/visited/route';

        beforeEach(() => {
            instance.addNavigationEvent(
                {
                    id: 1,
                    url: currentUrl,
                    urlAfterRedirects: currentUrl
                }
            );
        });

        navigateToPreviousRoute();

        it('should have 0 previous routes', () => {
            expect(instance.countPreviousRoutes).toBe(0);
        });

        it('should return current route for 0 steps back', () => {
            let url = instance.getPreviousRoute(0);
            expect(url).toBe(currentUrl);
        });

        it('should throw exception for 1 step back', () => {
            let errorMessage = `Cannot go back more than 0 steps, attempted to do 1 steps`;
            expect(() => instance.getPreviousRoute(1)).toThrowError(errorMessage);
        });
    });

    describe('with 2 pages in routing history', () => {
        let previouslyVisitedRoute = 'some/previously/visited/route';

        beforeEach(() => {
            instance.addNavigationEvent(
                {
                    id: 1,
                    url: previouslyVisitedRoute,
                    urlAfterRedirects: previouslyVisitedRoute
                }
            );
            instance.addNavigationEvent(
                {
                    id: 2,
                    url: 'some/currently/visited/route',
                    urlAfterRedirects: 'some/currently/visited/route',
                }
            );
        });

        it('should have 1 previous route', () => {
            expect(instance.countPreviousRoutes).toBe(1);
        });

        it('should navigate to previously visited route', () => {
            let dummyRoute = 'some/dummy/route';

            instance.navigateBackOrToRoute(dummyRoute);
            expect(router.navigate).toHaveBeenCalledWith([previouslyVisitedRoute]);
        });

        it('should return previous route for 1 steps back', () => {
            let url = instance.getPreviousRoute(1);
            expect(url).toBe(previouslyVisitedRoute);
        });

        it('should return previous route when number of steps unspecified', () => {
            let url = instance.getPreviousRoute();
            expect(url).toBe(previouslyVisitedRoute);
        });
    });
});
