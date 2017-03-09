import {Subject} from "rxjs";
import {Event, NavigationEnd} from "@angular/router";


export let RouterMock = {
    navigate: jasmine.createSpy('navigate'),
    events: new Subject<any>(),

    newEvent: function(event: Event) {
        this.events.next(event);
    },
    navigationEnd: function() {
        this.newEvent(new NavigationEnd(0, 'mock', 'mock'))
    }
};
