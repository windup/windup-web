import {Injectable} from "@angular/core";
import {Notification, NotificationLevel} from "./notification";
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from "rxjs";

@Injectable()
export class NotificationService {
    private _notifications: ReplaySubject<Notification>;

    constructor() {
        this._notifications = new ReplaySubject<Notification>(1);
    }

    public error(message: string) {
        this.notification(new Notification(message, NotificationLevel.ERROR));
    }

    public warning(message: string) {
        this.notification(new Notification(message, NotificationLevel.WARNING));
    }

    public info(message: string) {
        this.notification(new Notification(message, NotificationLevel.INFO));
    }

    public notice(message: string) {
        this.notification(new Notification(message, NotificationLevel.INFO));
    }

    public success(message: string) {
        this.notification(new Notification(message, NotificationLevel.SUCCESS));
    }

    public notification(notification: Notification) {
        this._notifications.next(notification);
    }


    get notifications(): Observable<Notification> {
        return this._notifications.asObservable();
    }
}
