import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router}   from '@angular/router';
import {NotificationService} from "../../core/notification/notification.service";
import {HardcodedIPDTO, HardcodedIPService} from "./hardcoded-ip.service";
import {utils} from "../../shared/utils";
import {FilterableReportComponent} from "../filterable-report.component";
import {RouteFlattenerService} from "../../core/routing/route-flattener.service";


@Component({
    templateUrl: 'hardcoded-ip.component.html',
    styleUrls: ['./hardcoded-ip.component.scss']
})
export class HardcodedIPReportComponent extends FilterableReportComponent implements OnInit {

    loading = true;
    searchText: string;

    filteredHardcodedIPs:HardcodedIPDTO[] = [];
    hardcodedIPs:HardcodedIPDTO[] = [];
    sortedHardcodedIPs:HardcodedIPDTO[] = [];


    constructor(_activatedRoute: ActivatedRoute,
                private _notificationService: NotificationService,
                _router: Router,
                private _hardcodedIPService:HardcodedIPService,
                _routeFlattener: RouteFlattenerService) {
        super(_router, _activatedRoute, _routeFlattener);

        this.addSubscription(this.flatRouteLoaded.subscribe(flatRouteData => {
            this.loadFilterFromRouteData(flatRouteData);

            this.loadHardcodedIPs();
        }));
    }

    ngOnInit(): void {
        
    }

    updateSearch(): void {
        if (this.searchText && this.searchText.length > 0) {
            this.filteredHardcodedIPs = this.hardcodedIPs.filter(item => {
                return  item.filename.search(new RegExp(this.searchText, 'i')) !== -1 ||
                        item.row.toString().search(new RegExp(this.searchText, 'i')) !== -1 ||
                        item.column.toString().search(new RegExp(this.searchText, 'i')) !== -1 ||
                        item.ipAddress.toString().search(new RegExp(this.searchText, 'i')) !== -1
            });
        } else {
            this.filteredHardcodedIPs = this.hardcodedIPs;
        }
    }

    clearSearch(): void {
        this.searchText = "";
        this.updateSearch();
    }

    setSortedData(event:HardcodedIPDTO[]) {
        this.sortedHardcodedIPs = event;
    }

    private loadHardcodedIPs() {
        this._hardcodedIPService.getHardcodedIPModels(this.execution.id, this.reportFilter)
            .subscribe(
                hardcodedIPDTOs => {
                    this.hardcodedIPs = this.filteredHardcodedIPs = this.sortedHardcodedIPs = hardcodedIPDTOs;
                    this.loading = false;
                },
                error => {
                    this._notificationService.error(utils.getErrorMessage(error));
                    this._router.navigate(['']);
                }
            );
    }
}

