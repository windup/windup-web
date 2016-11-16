import {Injectable} from "@angular/core";
import {Notification, NotificationLevel} from "./notification";
import {Subject} from "rxjs/Subject";
import {Observable} from 'rxjs/Observable';

@Injectable()
export class NotificationService {
    private _notifications: Subject<Notification>;

    constructor() {
        this._notifications = new Subject<Notification>();
    }

    public error(message: string) {
        this._notifications.next(new Notification(message, NotificationLevel.ERROR));
    }

    public warning(message: string) {
        this._notifications.next(new Notification(message, NotificationLevel.WARNING));

    }

    public info(message: string) {
        this._notifications.next(new Notification(message, NotificationLevel.INFO));

    }

    public notice(message: string) {
        this._notifications.next(new Notification(message, NotificationLevel.INFO));

    }

    public success(message: string) {
        this._notifications.next(new Notification(message, NotificationLevel.SUCCESS));

    }

    public notification(notification: Notification) {
        this._notifications.next(notification);
    }


    get notifications(): Observable<Notification> {
        return this._notifications.asObservable();
    }
}
