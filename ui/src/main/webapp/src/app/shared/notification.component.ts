import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {NotificationService} from "../core/notification/notification.service";
import {Subscription} from "rxjs/Subscription";
import {Notification, NotificationLevel} from "../core/notification/notification";

@Component({
    selector: 'wu-notification',
    templateUrl: './notification.component.html'
})
export class NotificationComponent implements OnInit, OnDestroy {
    @Input()
    protected displayedNotifications: number = 3;

    @Input()
    protected autoCloseNotifications: boolean = true;

    @Input()
    protected closeTimeout: number = 30;

    protected subscription: Subscription;

    protected notificationsStack: Notification[] = [];

    constructor(private _notificationService: NotificationService) {

    }

    ngOnInit(): any {
        this.subscription = this._notificationService.notifications.subscribe(notification => this.onNotification(notification))
    }

    onNotification(notification: Notification) {
        if (this.notificationsStack.length === this.displayedNotifications) {
            this.notificationsStack.pop();
        }

        this.notificationsStack.push(notification);

        if (this.autoCloseNotifications) {
            setTimeout(() => this.closeNotification(notification), this.closeTimeout * 1000);
        }
    }

    closeNotification(notification: Notification) {
        let index = this.notificationsStack.indexOf(notification);

        if (index !== -1) {
            this.notificationsStack.splice(index, 1);
        }
    }

    getClass(notification: Notification): string {
        switch (notification.level) {
            default:
            case NotificationLevel.INFO:
                return 'alert-info';
            case NotificationLevel.SUCCESS:
                return  'alert-success';
            case NotificationLevel.ERROR:
                return 'alert-danger';
            case NotificationLevel.WARNING:
                return 'alert-warning';
        }
    }

    getIcon(notification: Notification): string {
        switch (notification.level) {
            default:
            case NotificationLevel.INFO:
                return 'pficon-info';
            case NotificationLevel.SUCCESS:
                return  'pficon-ok';
            case NotificationLevel.ERROR:
                return 'pficon-error-circle-o';
            case NotificationLevel.WARNING:
                return 'pficon-warning-triangle-o';
        }
    }

    getInfoMessage(notification: Notification): string {
        switch (notification.level) {
            default:
            case NotificationLevel.SUCCESS:
            case NotificationLevel.INFO:
                return 'Info';
            case NotificationLevel.ERROR:
                return 'Error';
            case NotificationLevel.WARNING:
                return 'Warning';
        }
    }

    ngOnDestroy(): any {
        this.subscription.unsubscribe();
    }
}
