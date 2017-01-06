import {OnDestroy} from "@angular/core";
import {Subscription} from "rxjs";

export abstract class AbstractComponent implements OnDestroy {
    protected subscriptions: Subscription[] = [];

    public addSubscription(subscription: Subscription) {
        this.subscriptions.push(subscription);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
