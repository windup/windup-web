import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {NgZone} from '@angular/core';

import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule).then(app => {
    // this is just here to make some data easier to retrieve from tests
    window["app"]= app;
    window["MainNgZone"] = app.injector.get(NgZone);
    if (window["windupAppInitialized"] != null)
        window["windupAppInitialized"](app, window["MainNgZone"]);
}, err => {
    console.log(err);
    if (window["windupAppInitialized"] != null)
        window["windupAppInitialized"]();
});
