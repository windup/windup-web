import {WebSocketSubject, WebSocketSubjectConfig} from "rxjs/observable/dom/WebSocketSubject";
import {Observable, Observer, Subject} from "rxjs";

/**
 * Factory class for WebSocketSubjects - simplifies testing
 */
export class WebSocketSubjectFactory<T> {
    public createWebSocketSubject(urlConfigOrSource: string | WebSocketSubjectConfig | Observable<T>, destination?: Observer<T>): Subject<T> {
        return new WebSocketSubject<T>(urlConfigOrSource, destination);
    }
}
