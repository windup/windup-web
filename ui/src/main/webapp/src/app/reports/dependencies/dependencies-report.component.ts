import {Component} from "@angular/core";
import {DependenciesService} from "./dependencies.service";
import {ActivatedRoute} from "@angular/router";
import {AbstractComponent} from "../../shared/AbstractComponent";

@Component({
    template: `<wu-dependencies-graph [dependencies]="dependencies"></wu-dependencies-graph>`
})
export class DependenciesReportComponent extends AbstractComponent {
    dependencies: any[];

    constructor(private _activatedRoute: ActivatedRoute, private _dependenciesService: DependenciesService) {
        super();
    }

    ngOnInit(): void {
        this._activatedRoute.parent.parent.params.takeUntil(this.destroy).subscribe((params: {executionId: number}) => {
            let executionId = params.executionId;

            this._dependenciesService.getDependencies(executionId).takeUntil(this.destroy)
                .subscribe(dependencies => this.dependencies = dependencies);
        });
    }
}
