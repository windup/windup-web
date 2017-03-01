import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Injectable} from "@angular/core";
import {WindupEvent} from "./windup-event";

@Injectable()
export class EventBusService {
    protected eventSubscribers: Subject<WindupEvent>;
    public onEvent: Observable<WindupEvent>;

    constructor() {
        this.eventSubscribers = new Subject<WindupEvent>();
        this.onEvent = this.eventSubscribers.asObservable();
    }

    public fireEvent(event: WindupEvent) {
        console.log('Firing event: ', event);
        this.eventSubscribers.next(event);
    }
}
