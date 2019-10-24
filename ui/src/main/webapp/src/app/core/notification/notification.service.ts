import {Injectable} from "@angular/core";
import {Notification, NotificationLevel} from "./notification";
import {Observable} from 'rxjs';
import {ReplaySubject} from "rxjs";
import {NotificationService as ToastNotificationService, NotificationType} from 'patternfly-ng/notification';

@Injectable()
export class NotificationService {
    private _notifications: ReplaySubject<Notification>;

    constructor(private toastNotificationService: ToastNotificationService) {
        this._notifications = new ReplaySubject<Notification>(1, 100);
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

    // Patternflt toast notifications
    
    public errorToast(message: string, header: string = null) {
        this.toastNotificationService.message(NotificationType.DANGER, header, message, false, null, null);
    }

    public warningToast(message: string, header: string = null) {
        this.toastNotificationService.message(NotificationType.WARNING, header, message, true, null, null);
    }

    public infoToast(message: string, header: string = null) {
        this.toastNotificationService.message(NotificationType.INFO, header, message, false, null, null);
    }

    public successToast(message: string, header: string = null) {
        this.toastNotificationService.message(NotificationType.SUCCESS, header, message, false, null, null);
    }
}
