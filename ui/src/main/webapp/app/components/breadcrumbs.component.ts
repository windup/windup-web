import {Component} from '@angular/core';

import {Router} from '@angular/router';

@Component({
    selector: 'breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
})
export class BreadCrumbsComponent {
    public breadcrumbsCollection: Array<any> = [];

    constructor(private _router: Router) {
        this._router.events.subscribe(routeData => {
            // TODO - Reimplement with new router and current design document
            //
            //console.log("Routing data: " + routeData);
            //let instructions = [];

            //this._router.recognize(routeData.instruction.urlPath).then(instruction => {
            //    instructions.push(instruction);
            //
            //    while (instruction.child) {
            //        instruction = instruction.child;
            //
            //        instructions.push(instruction);
            //    }
            //    this.breadcrumbsCollection = instructions
            //        .map((inst, index) => {
            //            return {
            //                displayName: inst.component.routeData.get('displayName')
            //            }
            //        });
            //});
        });
    }
}