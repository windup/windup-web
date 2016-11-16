import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ApplicationGroup} from "windup-services";
import {WindupService} from "../../services/windup.service";

@Component({
    templateUrl: './group-layout.component.html',
    styles: [
        `:host /deep/ .nav-pf-vertical { top: 82px; }`,
//        `:host /deep/ .container-pf-nav-pf-vertical { margin-left: 200px; }`,
    ]
})
export class GroupLayoutComponent implements OnInit {
    protected applicationGroup: ApplicationGroup;
    protected menuItems;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _windupService: WindupService
    ) {

    }

    ngOnInit(): void {

    }

    protected createContextMenuItems() {
        this.menuItems = [
            {
                label: 'Config',
                link: 'configuration',
                icon: 'fa-cogs',
                isEnabled: true,
            },
            {
                label: 'Run Windup',
                link: '',
                icon: 'fa-rocket',
                isEnabled: true
            },
            {
                label: 'Dashboard',
                link: '',
                icon: 'fa-tachometer',
                isEnabled: true
            },
            {
                label: 'Issues',
                link: '',
                icon: 'fa-exclamation-triangle',
                isEnabled: true
            },
            {
                label: 'Technologies',
                link: '',
                icon: 'fa-cubes',
                isEnabled: true
            },
            {
                label: 'Dependencies',
                link: '',
                icon: 'fa-code-fork',
                isEnabled: true
            }
        ];
    }
}
