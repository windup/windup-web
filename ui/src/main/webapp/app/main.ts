import {bootstrap}    from '@angular/platform-browser-dynamic';
import {NgZone, provide} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {AppComponent} from './components/app.component'
import {Constants} from './constants';

import 'rxjs/Rx';

bootstrap(AppComponent,
    [
        HTTP_PROVIDERS,
        ROUTER_PROVIDERS,
        Constants,
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
