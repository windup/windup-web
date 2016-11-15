import {Routes, Route, Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {RouterConfigLoader} from "@angular/router/src/router_config_loader";

@Injectable()
export class RouteLinkProviderService {
    protected routes: Routes;

    protected routesByComponents = new Map<any, any>();

    constructor(private _router: Router) {
        this.routes = _router.config;
        let componentRoutes = this.getComponentRoutes(this.routes);
        console.log(componentRoutes);
        this.routesByComponents = this.getComponentRouteMap(componentRoutes);
    }

    protected getComponentRoutes(routes: Routes, predecessors: any[] = []): Route[] {
        let finalRoutes = [];

        routes.forEach((route: Route) => {
            if (this.isTopLevelRoute(route)) {
                finalRoutes.push(this.createRoutingEntry(route, predecessors));
            } else if (route.children) {
                let currentPredecessors = predecessors.slice().concat([route]);
                let nestedRoutes = this.getComponentRoutes(route.children, currentPredecessors);

                nestedRoutes.forEach(item => finalRoutes.push(item));
            } else if (route.loadChildren) {
                console.log("What now?");
                console.log(route);
            }
        });

        return finalRoutes;
    }

    protected isTopLevelRoute(route: Route) {
        return (!route.children || route.children.length === 0) && !route.loadChildren && route.component;
    }

    protected getComponentRouteMap(routingEntries: any[]) {
        let routesByComponents = new Map<any, any>();

        routingEntries.forEach((entry) => {
            routesByComponents.set(entry.route.component, entry);
        });

        return routesByComponents;
    }

    protected createRoutingEntry(route: Route, predecessors: Routes) {
        let result = {
            url: '',
            route: route,
            parameters: []
        };

        let fullRouteHierarchy = predecessors.concat([route]);

        fullRouteHierarchy.forEach((part: Route) => {
            if (part.path !== '' && part.path !== '/') {
                result.url += '/' + part.path;
            }
        });

        let parameters = result.url.match(/:(\w+)/g);

        if (parameters) {
            result.parameters = parameters.map(param => param.substring(1));;
        }

        return result;
    }

    public getRouteForComponent(component: any, parameters?: any|any[]|Object) {
        if (!this.routesByComponents.has(component)) {
            throw new Error("Route for component not found!")
        }

        let routingEntry = this.routesByComponents.get(component);
        let url = routingEntry.url;

        let routingParameters = {};
        if (routingEntry.parameters) {
            if (!parameters) {
                throw new Error("Route has parameters, but none were provided");
            }  else if (Array.isArray(parameters)) {
                routingParameters = this.getParametersFromArray(routingEntry.parameters, <any[]>parameters);
            } else if (typeof parameters === 'object') {
                routingParameters = this.getParametersFromObject(routingEntry.parameters, <Object>parameters);
            } else if (this.isScalar(parameters)) {
                if (routingEntry.parameters.length > 1) {
                    throw new Error("Route has multiple parameters, need to provide array or object with parameters");
                }

                routingParameters = {};
                routingParameters[routingEntry.parameters[0]] = parameters;
            }

            Object.keys(routingParameters).forEach((parameter) => {
                url = url.replace(':' + parameter, routingParameters[parameter]);
            });
        }

        return url;
    }

    protected isScalar(obj: any): boolean {
        return (/string|number|boolean/).test(typeof obj);
    }

    protected getParametersFromArray(expectedParameters: string[], givenParameters: any[]) {
        if (expectedParameters.length !== givenParameters.length) {
            throw new Error(`Expecting ${expectedParameters.length} parameters, but ${givenParameters.length} given`);
        }

        let routeParameters = {};

        expectedParameters.forEach((name, index) => {
            routeParameters[name] = givenParameters[index];
        });

        return routeParameters;
    }

    protected getParametersFromObject(expectedParameters: string[], givenParameters: {[key: string]: any}) {
        let routeParameters = {};

        expectedParameters.forEach((name) => {
            if (!givenParameters.hasOwnProperty(name)) {
                throw new Error(`Parameter ${name} not found in provided parameters object`);
            }

            routeParameters[name] = givenParameters[name];
        });

        return routeParameters;
    }
}
