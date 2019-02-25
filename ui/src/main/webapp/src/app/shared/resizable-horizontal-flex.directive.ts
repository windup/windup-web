import { Directive, ElementRef, Renderer2, OnInit, Input, OnDestroy, AfterViewInit } from "@angular/core";
import { Subscription, Observable } from "rxjs";

@Directive({
    selector: '[wuResizableHorizontalFlex]',

})
export class ResizableHorizontalFlexDirective implements OnInit, OnDestroy, AfterViewInit {

    private _resizable = true;
    private _origMousePos: Position = null;
    private _containment: any = null;

    /** Original Size and Position */
    private _origSize: Size = null;
    private _origPos: Position = null;

    /** Current Size and Position */
    private _currSize: Size = null;
    private _currPos: Position = null;

    private _bounding: any = null;


    /** Whether to prevent default event */
    @Input() preventDefaultEvent = true;

    /** The minimum width the resizable should be allowed to resize to. */
    @Input() wuMinWidth: number = null;

    /** The minimum width the resizable should left to other components. */
    @Input() wuMinWidthLeft: number = 0;

    private _handle: ResizeHandle;
    private _handleResizing: ResizeHandle = null;
    private draggingSub: Subscription = null;

    // For remove on media query
    private mediaQueryList: MediaQueryList;
    private mediaQueryListener: ((this: MediaQueryList, ev: any) => any);
    private mediaPreviousCondition: boolean = null;

    /** Disables the resizable if set to false. */
    @Input()
    set wuResizableFlex(v: any) {
        if (v !== undefined && v !== null && v !== '') {
            this._resizable = !!v;
            this.updateResizable();
        }
    }

    @Input()
    set wuMediaQuery(mediaQuery: string) {
        if (mediaQuery) {
            if (!this.mediaQueryList) {
                this.mediaQueryList = window.matchMedia(mediaQuery);

                /* Register for future events */
                this.mediaQueryListener = (mq) => {
                    this.onMediaMatchChange(mq.matches);
                };
                this.mediaQueryList.addListener(this.mediaQueryListener);
            }
            this.onMediaMatchChange(this.mediaQueryList.matches);
        }
    }

    private onMediaMatchChange(matches: boolean): void {
        if (matches && (!(this.mediaPreviousCondition) || !this.mediaPreviousCondition)) {
            this.mediaPreviousCondition = true;

            this._resizable = true;
            this.updateResizable();
        } else if (!matches && (!(this.mediaPreviousCondition) || this.mediaPreviousCondition)) {
            this.mediaPreviousCondition = false;

            this._resizable = false;
            this.updateResizable();
        }
    }

    constructor(private el: ElementRef, private renderer: Renderer2) {

    }

    ngOnInit() {
        this.updateResizable();
    }

    ngOnDestroy() {
        this.removeHandles();
        this._containment = null;

        this.mediaQueryList.removeListener(this.mediaQueryListener);
        this.mediaQueryList = this.mediaQueryListener = null;
    }

    ngAfterViewInit() {
        this.updateContainment();
    }

    /** A method to reset size */
    public resetSize() {
        const container = this.el.nativeElement;
        this.renderer.removeStyle(container, 'flex-basis');
        this.renderer.removeStyle(container, 'width');
    }

    private updateResizable() {
        const element = this.el.nativeElement;

        // clear handles:
        this.renderer.removeClass(element, 'wu-resizable');
        this.removeHandles();

        this.resetSize();

        // create new ones:
        if (this._resizable) {
            this.renderer.addClass(element, 'wu-resizable');
            this.createHandles();
        }
    }

    /** Use it to update containment */
    private updateContainment() {
        this._containment = this.el.nativeElement.parentElement;
    }

    /** Use it to create handle div */
    private createHandles() {
        const _el = this.el.nativeElement;
        this._handle = new ResizeHandle(_el, this.renderer, this.onMouseDown.bind(this));
    }

    private removeHandles() {
        if (this._handle) {
            this._handle.dispose();
        }
        this._handle = null;
    }

    onMouseDown(event: MouseEvent | TouchEvent, handle: ResizeHandle) {
        // skip right click;
        if (event instanceof MouseEvent && event.button === 2) {
            return;
        }

        if (this.preventDefaultEvent) {
            // prevent default events
            event.stopPropagation();
            event.preventDefault();
        }

        if (!this._handleResizing) {
            this._origMousePos = Position.fromEvent(event);
            this.startResize(handle);

            this.subscribeEvents();
        }
    }

    private subscribeEvents() {
        this.draggingSub = Observable.fromEvent(document, 'mousemove', { passive: false }).subscribe(event => this.onMouseMove(event as MouseEvent));
        this.draggingSub.add(Observable.fromEvent(document, 'touchmove', { passive: false }).subscribe(event => this.onMouseMove(event as TouchEvent)));
        this.draggingSub.add(Observable.fromEvent(document, 'mouseup', { passive: false }).subscribe(() => this.onMouseLeave()));
        this.draggingSub.add(Observable.fromEvent(document, 'mouseleave', { passive: false }).subscribe(() => this.onMouseLeave()));
        this.draggingSub.add(Observable.fromEvent(document, 'touchend', { passive: false }).subscribe(() => this.onMouseLeave()));
        this.draggingSub.add(Observable.fromEvent(document, 'touchcancel', { passive: false }).subscribe(() => this.onMouseLeave()));
    }

    private unsubscribeEvents() {
        this.draggingSub.unsubscribe();
        this.draggingSub = null;
    }

    onMouseLeave() {
        if (this._handleResizing) {
            this.stopResize();
            this._origMousePos = null;
            this.unsubscribeEvents();
        }
    }

    onMouseMove(event: MouseEvent | TouchEvent) {
        if (this._handleResizing && this._resizable && this._origMousePos && this._origPos && this._origSize) {
            this.resizeTo(Position.fromEvent(event));
        }
    }

    private startResize(handle: ResizeHandle) {
        const elm = this.el.nativeElement;
        this._origSize = Size.getCurrent(elm);
        this._origPos = Position.getCurrent(elm); // x: left, y: top
        this._currSize = Size.copy(this._origSize);
        this._currPos = Position.copy(this._origPos);
        if (this._containment) {
            this.getBounding();
        }

        this._handleResizing = handle;
    }

    private stopResize() {
        this._handleResizing = null;
        this._origSize = null;
        this._origPos = null;
        if (this._containment) {
            this.resetBounding();
        }
    }

    private resizeTo(p: Position) {
        p.subtract(this._origMousePos);

        this._currSize.width = this._origSize.width + p.x;

        this.checkBounds();
        this.checkSize();
        this.doResize();
    }

    private doResize() {
        const container = this.el.nativeElement;
        this.renderer.setStyle(container, 'flex-basis', this._currSize.width + 'px');
        this.renderer.setStyle(container, 'width', this._currSize.width + 'px');
    }

    private checkBounds() {
        if (this._containment) {
            const maxWidth = this._bounding.width - this._bounding.pr - this.el.nativeElement.offsetLeft - this._bounding.translateX - this.wuMinWidthLeft;

            if (this._currSize.width > maxWidth) {
                this._currSize.width = maxWidth;
            }

        }
    }

    private checkSize() {
        const minWidth = !this.wuMinWidth ? 1 : this.wuMinWidth;

        if (this._currSize.width < minWidth) {
            this._currSize.width = minWidth;

            this._currPos.x = this._origPos.x + (this._origSize.width - minWidth);
        }
    }

    private getBounding() {
        const el = this._containment;
        const computed = window.getComputedStyle(el);
        if (computed) {
            let p = computed.getPropertyValue('position');

            const nativeEl = window.getComputedStyle(this.el.nativeElement);
            let transforms = nativeEl.getPropertyValue('transform').replace(/[^-\d,]/g, '').split(',');

            this._bounding = {};
            this._bounding.width = el.clientWidth;
            this._bounding.height = el.clientHeight;
            this._bounding.pr = parseInt(computed.getPropertyValue('padding-right'), 10);
            this._bounding.pb = parseInt(computed.getPropertyValue('padding-bottom'), 10);

            if (transforms.length >= 6) {
                this._bounding.translateX = parseInt(transforms[4], 10);
                this._bounding.translateY = parseInt(transforms[5], 10);
            } else {
                this._bounding.translateX = 0;
                this._bounding.translateY = 0;
            }

            this._bounding.position = computed.getPropertyValue('position');

            if (p === 'static') {
                this.renderer.setStyle(el, 'position', 'relative');
            }
        }
    }

    private resetBounding() {
        if (this._bounding && this._bounding.position === 'static') {
            this.renderer.setStyle(this._containment, 'position', 'relative');
        }
        this._bounding = null;
    }

}


export class ResizeHandle {

    protected _handle: Element;
    private _onResize;

    constructor(
        protected parent: Element,
        protected renderer: Renderer2,
        private onMouseDown: any) {

        // generate handle div
        let handle = renderer.createElement('div');
        renderer.addClass(handle, 'wu-resizable-handle');

        // add default diagonal for se handle
        renderer.addClass(handle, 'wu-resizable-diagonal');
        renderer.addClass(handle, 'wu-resizable-se');

        // append div to parent
        if (this.parent) {
            parent.appendChild(handle);
        }

        // create and register event listener
        this._onResize = (event) => {
            onMouseDown(event, this);
        };
        handle.addEventListener('mousedown', this._onResize, { passive: false });
        handle.addEventListener('touchstart', this._onResize, { passive: false });

        // done
        this._handle = handle;
    }

    dispose() {
        this._handle.removeEventListener('mousedown', this._onResize);
        this._handle.removeEventListener('touchstart', this._onResize);

        if (this.parent) {
            this.parent.removeChild(this._handle);
        }
        this._handle = null;
        this._onResize = null;
    }

    get el() {
        return this._handle;
    }

}

export interface IPosition {
    x: number;
    y: number;
}

export class Position implements IPosition {
    constructor(public x: number, public y: number) { }

    static fromEvent(e: MouseEvent | TouchEvent, el: any = null) {
        if (e instanceof MouseEvent) {
            return new Position(e.clientX, e.clientY);
        } else {
            if (el === null || e.changedTouches.length === 1) {
                return new Position(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            }

            /**
             * Fix issue: Multiple phone draggables at the same time
             */
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].target === el) {
                    return new Position(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
                }
            }
        }
    }

    static isIPosition(obj): obj is IPosition {
        return !!obj && ('x' in obj) && ('y' in obj);
    }

    static getCurrent(el: Element) {
        let pos = new Position(0, 0);

        if (window) {
            const computed = window.getComputedStyle(el);
            if (computed) {
                let x = parseInt(computed.getPropertyValue('left'), 10);
                let y = parseInt(computed.getPropertyValue('top'), 10);
                pos.x = isNaN(x) ? 0 : x;
                pos.y = isNaN(y) ? 0 : y;
            }
            return pos;
        } else {
            console.error('Not Supported!');
            return null;
        }
    }

    static copy(p: IPosition) {
        return new Position(0, 0).set(p);
    }

    get value(): IPosition {
        return { x: this.x, y: this.y };
    }

    add(p: IPosition) {
        this.x += p.x;
        this.y += p.y;
        return this;
    }

    subtract(p: IPosition) {
        this.x -= p.x;
        this.y -= p.y;
        return this;
    }

    reset() {
        this.x = 0;
        this.y = 0;
        return this;
    }

    set(p: IPosition) {
        this.x = p.x;
        this.y = p.y;
        return this;
    }
}

export interface ISize {
    width: number;
    height: number;
}

export class Size implements ISize {
    constructor(public width: number, public height: number) { }

    static getCurrent(el: Element) {
        let size = new Size(0, 0);

        if (window) {
            const computed = window.getComputedStyle(el);
            if (computed) {
                size.width = parseInt(computed.getPropertyValue('width'), 10);
                size.height = parseInt(computed.getPropertyValue('height'), 10);
            }
            return size;
        } else {
            console.error('Not Supported!');
            return null;
        }
    }

    static copy(s: Size) {
        return new Size(0, 0).set(s);
    }

    set(s: ISize) {
        this.width = s.width;
        this.height = s.height;
        return this;
    }
}
