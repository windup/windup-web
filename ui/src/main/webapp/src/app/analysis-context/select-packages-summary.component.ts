import {
    Component, Input
} from "@angular/core";
import { Package } from "../generated/windup-services";

export interface PackageSelection {
    includePackages: Package[],
    excludePackages: Package[]
}

@Component({
    selector: 'wu-select-packages-summary',
    templateUrl: './select-packages-summary.component.html',
    styleUrls: ['./select-packages-summary.component.scss']
})
export class SelectPackagesSummaryComponent {

    @Input()
    packages: Package[];

    

}
