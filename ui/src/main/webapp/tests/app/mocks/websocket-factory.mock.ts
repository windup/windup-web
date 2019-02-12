import {WebSocketSubjectFactory} from "../../../src/app/shared/websocket.factory";
import {WebSocketSubjectConfig} from "rxjs/webSocket";
import {Observable, Observer, Subject} from "rxjs";

export class WebSocketSubjectFactoryMock<T> extends WebSocketSubjectFactory<T> {
    protected subjectStub: Subject<T>;

    public setSubjectStub(subject: Subject<T>) {
        this.subjectStub = subject;
    }

    public createWebSocketSubject(urlConfigOrSource: string | WebSocketSubjectConfig<T> | Observable<T>, destination?: Observer<T>): Subject<T> {
        return this.subjectStub;
    }
}
