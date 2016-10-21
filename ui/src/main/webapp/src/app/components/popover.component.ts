import {Component, OnInit, Input, ElementRef, ViewChild, QueryList, AfterViewInit} from "@angular/core";
import * as $ from "jquery";

@Component({
    selector: "w-popover",
    template: `<a   #popoverElement
                    tabindex="0" 
                    role="button" 
                    data-toggle="popover" 
                    data-trigger="focus" 
                    data-html="true"
                    data-placement="top"
                    [attr.data-content]="content"
                    class="fa fa-info-circle">
                </a>`
})
export class PopoverComponent implements AfterViewInit {
    @Input()
    content:string = "";

    @ViewChild("popoverElement")
    popoverElement:ElementRef;

    ngAfterViewInit() {
        console.log("Popover element: " + this.popoverElement.nativeElement);
        (<any>$(this.popoverElement.nativeElement)).popover();
    }
}
