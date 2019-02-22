import { Directive, HostListener } from "@angular/core";

@Directive({
    selector: '[wuStopPropagationIfNotMousedown]',

})
export class StopPropagationNotMousedownDirective {

    private mousedown: boolean = false;

    constructor() { }

    @HostListener('mousedown')
    onMousedown() {
        this.mousedown = true;
    }

    @HostListener('click', ['$event'])
    onMouseclick(event: any) {
        if (!this.mousedown) {
            event.stopPropagation();
            event.preventDefault();
        }
        this.mousedown == false;
    }

}
