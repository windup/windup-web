import {Component} from "@angular/core";
import {DefaultLayoutComponent} from "./default-layout.component";

@Component({
    templateUrl: './wizard-layout.component.html',
})
export class WizardLayoutComponent extends DefaultLayoutComponent {
    /**
     * TODO: Wizard layout and default layout are now almost the same, consider merging them into 1 component
     */
}
