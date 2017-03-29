import {Directive, ElementRef, OnInit, OnDestroy, Output, EventEmitter} from "@angular/core";
import {Observable, Subscription} from "rxjs";

@Directive({
    selector: '[wu-in-viewport]'
})
export class InViewport implements OnInit, OnDestroy {
    private static scrollSubscriber:Subscription;
    private static resizeSubscriber:Subscription;
    private static currentPosition:{top: number, bottom:number};
    private static subscribers:InViewport[] = [];

    @Output('inViewport')
    inViewport:EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private _element:ElementRef) { }

    ngOnInit() {
        InViewport.subscribers.push(this);
        InViewport.updateViewport();

        if (!InViewport.scrollSubscriber)
            InViewport.scrollSubscriber = Observable.fromEvent(window, "scroll").debounceTime(1000).subscribe(event => InViewport.updateViewport());

        if (!InViewport.resizeSubscriber)
            InViewport.resizeSubscriber = Observable.fromEvent(window, "resize").debounceTime(1000).subscribe(event => InViewport.updateViewport());

    }

    ngOnDestroy(): void {
        InViewport.subscribers.splice(InViewport.subscribers.indexOf(this), 1);

        if (InViewport.subscribers.length == 0) {
            InViewport.scrollSubscriber.unsubscribe();
            InViewport.resizeSubscriber.unsubscribe();
            InViewport.scrollSubscriber = null;
            InViewport.resizeSubscriber = null;
        }
    }

    static updateViewport() {
        let windowTop = window.pageYOffset;
        let windowBottom = windowTop + window.innerHeight;
        InViewport.currentPosition = { top: windowTop, bottom: windowBottom };

        InViewport.subscribers.forEach(subscriber => subscriber.checkInViewport());
    }

    checkInViewport() {
        let boundingRectangle = this._element.nativeElement.getBoundingClientRect();
        let elementTop = $(this._element.nativeElement).offset().top;
        let elementBottom = elementTop + boundingRectangle.height;

        let inView = false;
        if (elementTop > InViewport.currentPosition.top && elementTop < InViewport.currentPosition.bottom)
            inView = true;
        else if (elementBottom > InViewport.currentPosition.top && elementBottom < InViewport.currentPosition.bottom)
            inView = true;

        this.inViewport.emit(inView);
    }
}
