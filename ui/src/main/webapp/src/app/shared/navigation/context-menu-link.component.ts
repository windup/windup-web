import {Component, Input, ChangeDetectionStrategy} from "@angular/core";
import {ContextMenuItemInterface} from "./context-menu-item.class";

/**
 * This would ideally be directive which would apply (click) or [routerLink] to existing element
 * (And wouldn't force it to be <a> tag)
 *
 * But Angular currently cannot dynamically apply directives from directives.
 * See:
 *  https://github.com/angular/angular/issues/8785
 *  http://stackoverflow.com/questions/37148080/use-angular2-directive-in-host-of-another-directive
 *  http://stackoverflow.com/questions/39563547/how-to-instantiate-and-apply-directives-programmatically
 *
 * It cannot even replace existing code by component template:
 *  https://github.com/angular/angular/issues/3866
 *
 * So the only option is to use component as container and use <ng-content>
 *
 */
@Component({
    template: `
            <a *ngIf="item.action" (click)="click(item)"><ng-content></ng-content></a>
            <a *ngIf="!item.absolute" [routerLink]="getLink(item)"><ng-content select="[router-mode]"></ng-content></a>
            <div *ngIf="!item.absolute && item.innerMenuItem && item.innerMenuItem.length > 0" id="-secondary" class="nav-pf-secondary-nav">
                <div class="nav-item-pf-header">
                    <a class="secondary-collapse-toggle-pf"></a>
                    <span>{{item.label}}</span>
                </div>
                <ul class="list-group">
                    <li *ngFor="let secondLevelMenuItem of getEnabled(item.innerMenuItem)"
                        class="list-group-item" >
                        <a [routerLink]="[secondLevelMenuItem.link]">
                            <span class="list-group-item-value">{{secondLevelMenuItem.label}}</span>
                        </a>
                    </li>
                </ul>
            </div>
            <a *ngIf="item.absolute" [href]="item.link" [target]="item.target"><ng-content select="[absolute-mode]"></ng-content></a>`,
    selector: '[wu-context-menu-link]',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `a:focus { text-decoration: none; }

        /deep/ .nav-pf-vertical .list-group-item:hover .nav-pf-secondary-nav{
            opacity: 0.97;
            visibility: visible;
            left: 239px;
            top: 121px;
        }`
    ]
})
export class ContextMenuLinkComponent {
    @Input()
    item: ContextMenuItemInterface;

    click(item: ContextMenuItemInterface) {
        if (item.action) {
            item.action();
        }
    }

    getLink(item: ContextMenuItemInterface) {
        if (typeof item.link === 'function') {
            return item.link();
        } else {
            return item.link;
        }
    }

    getEnabled(items: ContextMenuItemInterface[]) : ContextMenuItemInterface[] {
        return items.filter(item => item.isEnabled);
    }

}
