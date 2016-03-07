import {bootstrap}    from 'angular2/platform/browser'
import {provide} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {AppComponent} from './components/app.component'
import {REST_BASE} from './constants';

import 'rxjs/Rx';

bootstrap(AppComponent,
    [
        HTTP_PROVIDERS,
        ROUTER_PROVIDERS,
        provide(REST_BASE, {useValue: REST_BASE.toString()})
    ]
);
