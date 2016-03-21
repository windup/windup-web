import {bootstrap}    from 'angular2/platform/browser'
import {NgZone, provide} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {AppComponent} from './components/app.component'
import {REST_BASE, STATIC_REPORTS_BASE} from './constants';

import 'rxjs/Rx';

bootstrap(AppComponent,
    [
        HTTP_PROVIDERS,
        ROUTER_PROVIDERS,
        provide(REST_BASE, {useValue: REST_BASE.toString()}),
        provide(STATIC_REPORTS_BASE, {useValue: STATIC_REPORTS_BASE.toString()})
    ]
).then(app => {
    window["app"]= app;
    window["MainNgZone"] = app.injector.get(NgZone);
    if (window["windupAppInitialized"] != null)
        window["windupAppInitialized"](app, window["MainNgZone"]);
}, err => {
    console.log(err);
    if (window["windupAppInitialized"] != null)
        window["windupAppInitialized"]();
});
