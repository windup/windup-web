import { platformBrowser } from '@angular/platform-browser';
import {NgZone} from '@angular/core';

import { KeycloakService } from './services/keycloak.service';

import { AppModuleNgFactory } from '../aot/app/app.module.ngfactory';

KeycloakService.init().then(
    o => {
        platformBrowser().bootstrapModuleFactory(AppModuleNgFactory).then(app => {
            // this is just here to make some data easier to retrieve from tests
            window["app"]= app;
            window["MainNgZone"] = app.injector.get(NgZone);
            if (window["windupAppInitialized"] != null)
                window["windupAppInitialized"](app, window["MainNgZone"]);
        }, err => {
            console.log(err);
            if (window["windupAppInitialized"] != null)
                window["windupAppInitialized"]();
        })},
    x => {
        window.location.reload();
    }
);
