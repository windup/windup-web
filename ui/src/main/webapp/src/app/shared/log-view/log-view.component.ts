import {
    Component, ChangeDetectionStrategy, Input, AfterViewChecked, ViewChild, ElementRef, OnInit
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

    isOnTop(): boolean {
        return document.body.scrollTop == 0;
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
