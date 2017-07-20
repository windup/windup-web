import {Injectable, NgZone} from "@angular/core";
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {EventBusService} from "../core/events/event-bus.service";
import {LoadingSomethingStartedEvent} from "../core/events/windup-event";
import {Observable} from "rxjs/Observable";

@Injectable()
export class LoaderIndicatorService {

    constructor(
        private _loadingBar: SlimLoadingBarService,
        private _eventBusService: EventBusService,
    ) {
        this._loadingBar.visible = false;
        _eventBusService.onEvent.do( event => {
            if (event instanceof LoadingSomethingStartedEvent)
                this.loadingStarted();
            else if (event instanceof LoadingSomethingStartedEvent)
                this.loadingFinished();
        });
    }


    private counter: number = 0;
    private max: number = void 0;

    public loadingStarted(){
        this.counter++;
        this._loadingBar.visible = true;
        this.updateProgress();
    }

    public loadingFinished(){
        this.counter--;
        this.updateProgress();
    }

    private updateProgress() {
        if (this.counter == 0) {
            Observable.timer(1).do(() => this._loadingBar.visible = false);
        }
        else {
            // max - counter = finished.
            // If the things to load are added after something loaded, the progress would go back.
            // But let's rely on that loading will start fast at the beginning.
            // Start at 20, jump to 90.
            this._loadingBar.progress = 20 + 70 * (1 - this.max / this.counter);
        }
    }

}
