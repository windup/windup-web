import {OnDestroy} from "@angular/core";
import {Subscription} from "rxjs";
import {Subject} from "rxjs/Subject";

export abstract class AbstractComponent implements OnDestroy {
    protected subscriptions: Subscription[] = [];
    protected destroy: Subject<boolean> = new Subject<boolean>();

    public addSubscription(subscription: Subscription) {
        this.subscriptions.push(subscription);
    }

    ngOnDestroy(): void {
        this.destroy.next(true);
        this.destroy.unsubscribe();
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
