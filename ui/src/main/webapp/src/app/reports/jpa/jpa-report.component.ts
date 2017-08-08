import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router}   from '@angular/router';

import {JpaReportInfo, JpaReportService} from "./jpa-report.service";
import {NotificationService} from "../../core/notification/notification.service";
import {utils} from '../../shared/utils';
import {ProjectTechnologiesStatsModel} from "../../generated/tsModels/ProjectTechnologiesStatsModel";
import {forkJoin} from "rxjs/observable/forkJoin";
import {ProjectModel} from "../../generated/tsModels/ProjectModel";
import {FileModel} from "../../generated/tsModels/FileModel";
import {TechnologyKeyValuePairModel} from "../../generated/tsModels/TechnologyKeyValuePairModel";
import {FilterApplication, RegisteredApplication} from "../../generated/windup-services";
import {GraphService} from "../../services/graph.service";
import {JPANamedQueryModel} from "../../generated/tsModels/JPANamedQueryModel";
import {JPAEntityModel} from "../../generated/tsModels/JPAEntityModel";
import {JPAPersistenceUnitModel} from "../../generated/tsModels/JPAPersistenceUnitModel";
import {JPAConfigurationFileModel} from "../../generated/tsModels/JPAConfigurationFileModel";
import {Observable} from "rxjs/Observable";
import {JavaClassFileModel} from "../../generated/tsModels/JavaClassFileModel";
import {JavaClassModel} from "../../generated/tsModels/JavaClassModel";

@Component({
    selector: 'wu-jpa-report',
    templateUrl: 'jpa-report.component.html'
})
export class JpaReportComponent implements OnInit {
    private jpaInfo: JpaReportInfo;

    private execID: number;

    constructor(
        private jpaReportService: JpaReportService,
        private _notificationService: NotificationService,
        //private _graph: GraphService,
        private _router: Router,
        private route: ActivatedRoute,
    ){}



    ngOnInit(): void {
        this.route.parent.params.forEach((params: Params) => {
            this.execID = +params['executionId'];
            this.fetchJpaInfo();
        });
    }


    fetchJpaInfo(): void {
        let onError = function(error) {
            this._notificationService.error(utils.getErrorMessage(error));
            this._router.navigate(['']);
        };
        this.jpaReportService.getJpaInfo(this.execID).subscribe(jpaInfo => this.jpaInfo = jpaInfo, onError);
    }

    navigateToClassAsync(javaClass: Observable<JavaClassModel>) {
        javaClass.subscribe(cls => {
            cls.decompiledSource.subscribe( src => {
                this._router.navigate(['../source/' + src.vertexId]);
            })
        } );
    }
}

