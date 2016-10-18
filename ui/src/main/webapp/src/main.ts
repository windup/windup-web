import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {NgZone, enableProdMode} from "@angular/core";
import {KeycloakService} from "./app/services/keycloak.service";
import {AppModule} from "./app/app.module";

require('./keycloak.json.ftl');
require('../css/windup-web.css');

if (process.env.ENV === 'production') {
    enableProdMode();
}

KeycloakService.init().then(
    success => {
        platformBrowserDynamic().bootstrapModule(AppModule).then(app => {
            // this is just here to make some data easier to retrieve from tests
            window["app"]= app;
            window["MainNgZone"] = app.injector.get(NgZone);
            if (window["windupAppInitialized"] != null)
                window["windupAppInitialized"](app, window["MainNgZone"]);
        })
        .catch(err => {
            console.log(err);
            if (window["windupAppInitialized"] != null)
                window["windupAppInitialized"]();
        });
    }
).catch(error => {
    console.log('reload');
    // window.location.reload();
});
