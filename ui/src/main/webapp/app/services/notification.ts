export enum NotificationLevel {
    WARNING, //= 'warning',
    INFO, //= 'info',
    ERROR, //= 'error',
    SUCCESS //= 'success'
}

export class Notification {
    public constructor(private _message: string, private _level: NotificationLevel) {

    }

    get message(): string {
        return this._message;
    }

    get level(): NotificationLevel {
        return this._level;
    }
}
