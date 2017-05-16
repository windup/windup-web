import {
    Component, ChangeDetectionStrategy, Input, AfterViewChecked, ViewChild, ElementRef, HostListener
} from "@angular/core";

@Component({
    templateUrl: './log-view.component.html',
    styleUrls: ['./log-view.component.scss'],
    selector: 'wu-log-view',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogViewComponent implements AfterViewChecked {
    private _text: string;

    @ViewChild('logview') private myScrollContainer: ElementRef;
    autoScrollActive: boolean = false;
    onTop: boolean = true;

    @Input()
    lines: string[] = [ "Loading..." ];

    constructor() {

    }

    ngAfterViewChecked() {
        if (this.autoScrollActive) this.goToBottom();
    }

    goToBottom(): void {
        /* TO-DO
         Only FF supports scrollIntoViewOptions to get a better scrolling behaviour.
         https://developer.mozilla.org/en/docs/Web/API/Element/scrollIntoView#Browser_compatibility
         if (this.autoScrollActive) this.myScrollContainer.nativeElement.scrollIntoView({block: "end", behavior: "smooth"});
         */
        this.myScrollContainer.nativeElement.scrollIntoView(false);
    }

    toggleAutoScroll(): void {
        this.autoScrollActive = !this.autoScrollActive;
        if (this.autoScrollActive) this.goToBottom();
    }

    onScrollTop(): void {
        this.autoScrollActive = false;
        window.scrollTo(null, 0);
    }

    @HostListener('window:DOMMouseScroll', ['$event'])
    private scrollListenerDOMMouse(event) {
        this._scrolled(event);
    }

    @HostListener('window:mousewheel', ['$event'])
    private scrollListenerMouseWheel(event) {
        this._scrolled(event);
    }

    @HostListener('window:onmousewheel', ['$event'])
    private scrollListenerOnMouseWheel(event) {
        this._scrolled(event);
    }

    @HostListener('window:scroll', ['$event'])
    private anyScroll(event) {
        this.onTop = (document.body.scrollTop < 121);
        console.log("On top: " + this.onTop + " scroll top: " + document.body.scrollTop);
    }

    @HostListener('window:keydown', ['$event'])
    private scrollListenerOnKeyboard(event) {
        switch (event.keyCode) {
            case 35: // end
            case 36: // home
            case 38: // up arrow
            case 40: // down arrow
            case 33: // page up
            case 34: // page down
                this._scrolled(event);
                break;
            default:
                return;
        }
    }

    private _scrolled(event) {
        /*
         121 is the height in pixel of two top nav bars
         */
        this.autoScrollActive = false;
    }

    @Input()
    public set text(text: string) {
        if (!text) {
            text = '';
        }

        this._text = text;
        this.lines = text.split(/\r?\n/g);
    }
}
