import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot} from "@angular/router";

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
}
