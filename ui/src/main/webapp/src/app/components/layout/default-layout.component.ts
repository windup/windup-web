import {Component} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent {
    constructor(private router: Router) {
        router.events.subscribe((event) => {
            console.log('Default component event');
            console.log(event);
        });

        router.events.pairwise().subscribe((e) => {
            console.log('Default component pairwise');
            console.log(e);
        });
    }
}
