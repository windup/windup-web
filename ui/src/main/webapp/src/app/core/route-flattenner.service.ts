import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";

@Injectable()
export class RouteFlattenerService {
    getFlatRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
        let flatRoute = Object.assign({}, route);

        if (route.parent) {
            let flatParent = this.getFlatRoute(route.parent);
            flatRoute.params = Object.assign({}, flatRoute.params, flatParent.params);
            flatRoute.data = Object.assign({}, flatRoute.data, flatParent.data);
        }

        return flatRoute;
    }

    getFlatRouteObservable(route: ActivatedRoute): Observable<any> {
        let result = {
            data: {},
            params: {}
        };

        let parentObservable;

        if (route.parent) {
            parentObservable = this.getFlatRouteObservable(route.parent);
        } else {
            parentObservable = Observable.of({data: {}, params: {}});
        }

        let currentObservable = Observable.forkJoin(route.params, route.data).map(data => {
            return {
                params: data[0],
                data: data[1]
            };
        });

        return Observable.forkJoin(parentObservable, currentObservable).map(data => {
            let result = Object.assign({}, data[0], data[1]);
            return result;
        });
    }
}
