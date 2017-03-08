import {Component} from "@angular/core";
import {DependenciesService} from "./dependencies.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    template: `<wu-dependencies-graph [dependencies]="dependencies"></wu-dependencies-graph>`
})
export class DependenciesReportComponent {
    dependencies: any[];

    constructor(private _activatedRoute: ActivatedRoute, private _dependenciesService: DependenciesService) {

    }

    ngOnInit(): void {
        this._activatedRoute.parent.parent.params.subscribe((params: {executionId: number}) => {
            let executionId = params.executionId;

            this._dependenciesService.getDependencies(executionId)
                .subscribe(dependencies => this.dependencies = dependencies);
        });
    }
}
