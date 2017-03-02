import {Directive, ElementRef, OnInit, OnDestroy, Output, EventEmitter} from "@angular/core";
import {Observable, Subscription} from "rxjs";

@Directive({
    selector: '[wu-in-viewport]'
})
export class InViewport implements OnInit, OnDestroy {
    private scrollSubscriber:Subscription;
    private resizeSubscriber:Subscription;

    @Output('inViewport')
    inViewport:EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private _element:ElementRef) { }

    ngOnInit() {
        this.checkInViewport();

        this.scrollSubscriber = Observable.fromEvent(window, "scroll").debounceTime(500).subscribe(event => this.checkInViewport());
        this.resizeSubscriber = Observable.fromEvent(window, "resize").debounceTime(500).subscribe(event => this.checkInViewport());
    }

    ngOnDestroy(): void {
        this.scrollSubscriber.unsubscribe();
        this.resizeSubscriber.unsubscribe();
    }

    checkInViewport() {
        let boundingRectangle = this._element.nativeElement.getBoundingClientRect();
        let elementTop = $(this._element.nativeElement).offset().top;
        let elementBottom = elementTop + boundingRectangle.height;
        //console.log("Element: ", this._element.nativeElement);
        //console.log("Element top,bottom: ", elementTop, elementBottom);

        let windowTop = window.pageYOffset;
        let windowBottom = windowTop + window.innerHeight;
        //console.log("Window top,bottom: ", windowTop, windowBottom);

        let inView = false;
        if (elementTop > windowTop && elementTop < windowBottom)
            inView = true;
        else if (elementBottom > windowTop && elementBottom < windowBottom)
            inView = true;

        //console.log("returning inView: " + inView);
        this.inViewport.emit(inView);
    }
}