import {Directive, ElementRef, Input, OnChanges, OnDestroy, Renderer, SimpleChanges} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";
import {Subscription} from "rxjs";

/**
 * Yet another workaround for angular limitation
 *
 * Angular [routerLinkActive] directive works ONLY on routed <a> element or its direct parent.
 * You cannot simply use it on other elements.
 * (or maybe you can, but it doesn't work for elements projected by <ng-content>)
 *
 * Aim of this directive is to fix that stupid limitation.
 * It fixes it by having route parameter, so it can compare current route with given one.
 *
 * Please watch official source codes for [routerLinkActive] directive:
 * https://github.com/angular/angular/blob/master/packages/router/src/directives/router_link_active.ts
 * if anything changes and official support gets better, it might not be necessary to use this workaround anymore.
 */
@Directive({
    selector: '[wu-is-route-active]'
})
export class IsRouteActiveDirective implements OnChanges, OnDestroy {
    /**
     * Router link
     *
     * @type {string[]|string}
     */
    @Input()
    public routerLink: string|string[] = [];

    /**
     * CSS classes to use when route is active
     *
     * @type {string[]}
     */
    @Input()
    public activeClasses: string[] = [];

    protected routerSubscription: Subscription;

    protected wasPreviouslyActive: boolean;

    constructor(protected _element: ElementRef, protected _renderer: Renderer, protected _router: Router) {
        this.routerSubscription = this._router.events.filter(event => event instanceof NavigationEnd)
            .subscribe(_ => this.update());
    }


    ngOnDestroy(): void {
        this.routerSubscription.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.update();
    }

    update() {
        if (!this._router.navigated || !this.routerLink) {
            return;
        }

        const isActive = this.isRouteActive();

        if (this.wasPreviouslyActive !== isActive) {
            this.activeClasses.forEach(
                cssClass => this._renderer.setElementClass(this._element.nativeElement, cssClass, isActive)
            );

            /**
             * This is taken from original Angular isRouteLinkActive code
             * I'm not sure why Promise is needed, but I think it is similar to setTimeout(0)
             *  - to avoid changing parameters during running change detection
             */
            Promise.resolve(isActive).then(active => this.wasPreviouslyActive = active);
        }
    }

    protected isRouteActive() {
        const routeUrl = Array.isArray(this.routerLink) ? this.routerLink.join('') : this.routerLink;

        return this._router.isActive(routeUrl, false);
    }
}
