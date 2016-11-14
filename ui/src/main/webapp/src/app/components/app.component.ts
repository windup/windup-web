import {Component} from "@angular/core";
import {Router} from "@angular/router";
import 'rxjs/add/operator/pairwise';

@Component({
    selector: 'windup-app',
    templateUrl: 'app.component.html'
})
export class AppComponent {

    /*
     * This is for Augury Chrome extension to display router tree
     * See https://github.com/rangle/augury/issues/715
     *
     * When extension is fixed, this can be safely removed
     */
    constructor(private router: Router) {
        router.events.subscribe((event) => {
            console.log('App component event');
            console.log(event);
        });

        router.events.pairwise().subscribe((e) => {
            console.log('App component event pariwise');
            console.log(e);
        });
    }
}
