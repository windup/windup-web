import { Directive, ElementRef, Renderer2, Input, OnDestroy } from "@angular/core";

@Directive({
    selector: '[wuMediaQueryStyle]',

})
export class MediaQueryStyleDirective implements OnDestroy {

    private _wuMediaQueryStyle: string;
    private _wuMediaStyle: any;

    // For remove on media query
    private mediaQueryList: MediaQueryList;
    private mediaQueryListener: ((this: MediaQueryList, ev: any) => any);
    private mediaPreviousCondition: boolean = null;

    constructor(private el: ElementRef, private renderer: Renderer2) {

    }

    ngOnDestroy() {
        this.mediaQueryList.removeListener(this.mediaQueryListener);
        this.mediaQueryList = this.mediaQueryListener = null;
    }

    get wuMediaQueryStyle(): string {
        return this._wuMediaQueryStyle;
    }

    get wuMediaStyle(): any {
        return this._wuMediaStyle;
    }

    @Input()
    set wuMediaQueryStyle(wuMediaQueryStyle: string) {
        this._wuMediaQueryStyle = wuMediaQueryStyle;
        if (this._wuMediaQueryStyle) {
            if (!this.mediaQueryList) {
                this.mediaQueryList = window.matchMedia(this._wuMediaQueryStyle);

                /* Register for future events */
                this.mediaQueryListener = (mq) => {
                    this.onMediaMatchChange(mq.matches);
                };
                this.mediaQueryList.addListener(this.mediaQueryListener);
            }
            this.updateComponent();
        }
    }

    @Input()
    set wuMediaStyle(wuMediaStyle: any) {
        this._wuMediaStyle = wuMediaStyle;
        if (this._wuMediaStyle) {
            this.updateComponent();
        }
    }

    updateComponent(): void {
        this.onMediaMatchChange(this.mediaQueryList.matches);
    }

    private onMediaMatchChange(matches: boolean): void {
        if (!this._wuMediaQueryStyle || !this._wuMediaStyle) {
            return;
        }

        if (matches && (!(this.mediaPreviousCondition) || !this.mediaPreviousCondition)) {
            this.mediaPreviousCondition = true;

            if (this._wuMediaQueryStyle && this._wuMediaStyle) {
                const styleMap = this._wuMediaStyle;
                Object.keys(styleMap).forEach((key) => {
                    const value: string = styleMap[key];
                    this.renderer.setStyle(this.el.nativeElement, key, value);
                });
            }
        } else if (!matches && (!(this.mediaPreviousCondition) || this.mediaPreviousCondition)) {
            this.mediaPreviousCondition = false;

            if (this._wuMediaQueryStyle && this._wuMediaStyle) {
                Object.keys(this._wuMediaStyle).forEach((key) => {
                    this.renderer.removeStyle(this.el.nativeElement, key);
                });
            }
        }
    }

}