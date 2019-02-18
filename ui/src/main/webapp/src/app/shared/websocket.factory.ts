import {WebSocketSubject, WebSocketSubjectConfig} from "rxjs/webSocket";
import {Observable, Observer, Subject} from "rxjs";

/**
 * Factory class for WebSocketSubjects - simplifies testing
 */
export class WebSocketSubjectFactory<T> {
    public createWebSocketSubject(urlConfigOrSource: string | WebSocketSubjectConfig<T> | Observable<T>, destination?: Observer<T>): Subject<T> {
        return new WebSocketSubject<T>(urlConfigOrSource, destination);
    }
}
