import {Component, ElementRef} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'navbar',
    templateUrl: 'app/components/navbar.component.html'
})
export class NavbarComponent {
    constructor(private _router:Router) {

    }

    isActive(link:HTMLAnchorElement):boolean {
        if (link == null)
            return false;

        let linkAttribute = link.attributes.getNamedItem("routerLink");
        if (linkAttribute == null)
            return false;

        return linkAttribute.value == this._router.url;
    }
}