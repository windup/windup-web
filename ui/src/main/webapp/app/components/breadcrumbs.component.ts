import {Component} from '@angular/core';

import {Router, RouteParams} from "@angular/router-deprecated";

@Component({
    selector: 'breadcrumbs',
    templateUrl: 'app/components/breadcrumbs.component.html'
})
export class BreadCrumbsComponent {
    public breadcrumbsCollection: Array<any> = [];

    constructor(private _router: Router) {
        this._router.subscribe(routeData => {
            let instructions = [];

            this._router.recognize(routeData.instruction.urlPath).then(instruction => {
                instructions.push(instruction);

                while (instruction.child) {
                    instruction = instruction.child;

                    instructions.push(instruction);
                }
                this.breadcrumbsCollection = instructions
                    .map((inst, index) => {
                        return {
                            displayName: inst.component.routeData.get('displayName')
                        }
                    });
            });
        });
    }
}