import {Injectable} from "@angular/core";
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {EventBusService} from "./events/event-bus.service";
import {LoadingSomethingFinishedEvent, LoadingSomethingStartedEvent} from "./events/windup-event";
import {Observable} from "rxjs/Observable";

@Injectable()
export class LoadingIndicatorService {

    constructor(
        private _slimBarService: SlimLoadingBarService,
        private _eventBusService: EventBusService,
    ) {
        this._slimBarService.visible = false;

        // One way of registering...
        /*this._eventBusService.onEvent.subscribe( event => {
            console.log("event received ANY");
            if (event instanceof LoadingSomethingStartedEvent) {
                this.loadingStarted();
            }
            if (event instanceof LoadingSomethingFinishedEvent)
                this.loadingFinished();
        });
        */
        // 2nd way of registering
        this._eventBusService.onEvent
            .filter(event => event.isTypeOf(LoadingSomethingStartedEvent))
            .subscribe((event: LoadingSomethingStartedEvent) => this.loadingStarted() )
        this._eventBusService.onEvent
            .filter(event => event.isTypeOf(LoadingSomethingFinishedEvent))
            .subscribe((event: LoadingSomethingFinishedEvent) => this.loadingFinished() )
    }

    public getSlimService(){
        return this._slimBarService;
    }


    private counter: number = 0;
    private max: number = void 0;

    private reset() {
        this.counter = 0;
        this.max = void 0;
        console.log(`xreset(), counter ${this.counter}`);
    }

    public loadingStarted(){
        this.counter++;
        this.max = this.counter;
        console.log(`event received START, counter ${this.counter}`);
        //this._slimBarService.visible = true;
        this.updateProgress();
    }

    public loadingFinished(){
        this.counter--;
        console.log(`event received FINISH, counter ${this.counter}`);
        this.updateProgress();
    }

    private updateProgress() {
        console.log(`updateProgress(), counter ${this.counter}`);
        if (this.counter == 0) {
            console.log("INDI All finished, hiding.");
            Observable.timer(1).do(() => this._slimBarService.visible = false);
        }
        else {
            // max - counter = finished.
            // If the things to load are added after something loaded, the progress would go back.
            // But let's rely on that loading will start fast at the beginning.
            // Start at 20, jump to 90.
            let percent = 20 + 70 * (1 - this.max / this.counter);
            console.log(`INDI Setting bar to ${percent} percent.`);
            this._slimBarService.visible = true;
            this._slimBarService.progress = 60; //percent;
        }
    }

}
