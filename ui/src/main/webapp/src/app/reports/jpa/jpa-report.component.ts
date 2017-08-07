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
    templateUrl: 'jpa-report.component.html',
    styleUrls: ['../../../../css/report-tables.scss'],
})
export class JpaReportComponent implements OnInit {

    private jpaInfo: JpaReportInfo = new JpaReportInfo();

    private execID: number;

    private searchText: string;

    private loading = true;

    private emptyFilterCallbacks = {
        entities: (entity) => true,
        namedQueries: (file) => true,
        configurationFiles: (file) => true,
        persistenceUnits: (factory) => true
    };

    private filterCallbacks = Object.assign({}, this.emptyFilterCallbacks);


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
        let onError = (error) => {
            this._notificationService.error(utils.getErrorMessage(error));
            this._router.navigate(['']);
        };
        this.jpaReportService.getJpaInfo(this.execID).subscribe(jpaInfo => this.jpaInfo = jpaInfo, onError);
        this.loading = false;
    }


    private updateSearch() {
        const regex = new RegExp(this.searchText, 'i');

        this.filterCallbacks = Object.assign({}, {
            entities: this.filterEntities(regex),
            namedQueries: this.filterNamedQueries(regex),
            configurationFiles: this.filterConfigurationFiles(regex),
            persistenceUnits: this.filterPersistenceUnits(regex)
        });
    }

    private clearSearch() {
        this.searchText = '';
        this.filterCallbacks = Object.assign({}, this.emptyFilterCallbacks);
    }

    private filterEntities(regex: RegExp) {
        let re: RegExp = typeof regex === "string" ? new RegExp(regex) : regex;

        return (entity) => re.test(entity.name) || re.test(entity.tableName);
    }

    private filterNamedQueries(regex: RegExp) {
        return (namedQuery) => regex.test(namedQuery.name);
    }

    private filterConfigurationFiles(regex: RegExp) {
        return (file) => regex.test(file.cachedPrettyPath);
    }

    private filterPersistenceUnits(regex: RegExp) {
        return (pu) => regex.test(pu.name);
    }
}

