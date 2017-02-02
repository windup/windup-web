import {Component} from "@angular/core";
import {DependenciesService} from "./dependencies.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    templateUrl: './dependencies-report.component.html'
})
export class DependenciesReportComponent {
    dependencies: any[];
    technologies: any[];

    showDependencies: boolean = true;
    showTechDependencies: boolean = false;

    constructor(private _activatedRoute: ActivatedRoute, private _dependenciesService: DependenciesService) {

    }

    ngOnInit(): void {
        this._activatedRoute.parent.params.subscribe((params: {executionId: number}) => {
            let executionId = params.executionId;

            this._dependenciesService.getDependencies(executionId)
                .subscribe(dependencies => this.dependencies = dependencies);

            this._dependenciesService.getTechnologyDependencies(executionId)
                .subscribe(techDependencies => this.technologies = techDependencies);
        });
    }
}
