import { Directive, ElementRef, Renderer2, Input } from "@angular/core";

@Directive({
    selector: '[wuMediaQueryStyle]',

})
export class MediaQueryStyleDirective {

    private _wuMediaQueryStyle: string;

    private _wuMediaStyle: any;

    // For remove on media query
    private mediaQueryList: MediaQueryList;
    private mediaQueryListener: ((this: MediaQueryList, ev: any) => any);
    private mediaPreviousCondition: boolean = null;

    constructor(private el: ElementRef, private renderer: Renderer2) {

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

    private onMediaMatchChange(matches: boolean): void {
        console.log("aca");
        if (matches && (!(this.mediaPreviousCondition) || !this.mediaPreviousCondition)) {
            this.mediaPreviousCondition = true;

            if (this._wuMediaQueryStyle && this._wuMediaStyle) {
                Object.keys(this._wuMediaStyle).forEach(function (key) {
                    const value: string = this._mediaStyle[key];
                    this.renderer.setStyle(this.el.nativeElement, key, value);
                });
            }
        } else if (!matches && (!(this.mediaPreviousCondition) || this.mediaPreviousCondition)) {
            this.mediaPreviousCondition = false;

            if (this._wuMediaQueryStyle && this._wuMediaStyle) {
                Object.keys(this._wuMediaStyle).forEach(function (key) {
                    const value: string = this._mediaStyle[key];
                    this.renderer.removeStyle(this.el.nativeElement, key, value);
                });
            }
        }
    }

    @Input()
    set wuMediaStyle(wuMediaStyle: any) {
        this._wuMediaStyle = wuMediaStyle;
        this.updateComponent();
    }

    updateComponent(): void {
        this.onMediaMatchChange(this.mediaQueryList.matches);
    }

}